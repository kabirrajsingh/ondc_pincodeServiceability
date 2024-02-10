import itertools,functools,sys
import utils
import pickle
from google.cloud import storage
import sys
from flask import jsonify
sys.setrecursionlimit(1000000)
bucket_name = ''
blob_name = ''
file_path = '/tmp/binary_tree.bin'  
    


class Node:
  COMPANY_NODE="company"
  PINCODE_NODE="pincode"  
  def __init__(self,data,node_type):
    self.data=data
    self.node_type=node_type
    self.num_word=0
    self.trans:dict[str:Node]=dict()
    self.parent=None
    self.skip_trie_trans:set[Node]=set() # for intra-trie connections
  
  def __str__(self):
    return f"""
    Node(
      data:{self.data}
      node_type:{self.node_type}
      num_word:{self.num_word}
      trans:{list(self.trans.keys())}
      parent:{self.parent.data if self.parent is not None else None}
      skip_trie_trans:{[node.data for node in self.skip_trie_trans]}
    )
    """

  def __repr__(self):
    return str(self)
  

class DoubleTrie:
  def __init__(self,company_pincode_pair_list:list):
    self.company_trie_head=Node("",Node.COMPANY_NODE)
    self.pincode_trie_head=Node("",Node.PINCODE_NODE)

    for company,pincode in company_pincode_pair_list:
      self.add_string_uniq(company,Node.COMPANY_NODE)
      self.add_string_uniq(pincode,Node.PINCODE_NODE)
      self.make_intra_trie_conns(company,pincode)

    self.optimize_conns_dfs()




  def add_string_uniq(self,string,type):
    head=self.__set_head_by_type(type)
    for i in string:
      if head.trans.get(i) is None:
        head.trans[i]=Node(i,type)
        head.trans[i].parent=head
      head=head.trans[i]
    head.num_word=1 #only unique strings

  def __set_head_by_type(self,type):
    if type==Node.COMPANY_NODE:
      head=self.company_trie_head
    elif type==Node.PINCODE_NODE:
      head=self.pincode_trie_head
    
    return head
  
  def __get_node(self,string,type,raise_exception:bool=True):
    head=self.__set_head_by_type(type)
    for index,i in enumerate(string):
      head=head.trans.get(i,None)
      if not head:
        if not raise_exception:
          break
        raise Exception(f"char({i}) node at index({index}) of string({string}) not found in trie({type})")
        
    return head

  def exist_string_in_trie(self,string,type):
    node=self.__get_node(string,type,False)
    if node is None:
      return False
    elif node.num_word==0:
      return False
    else:
      return True
  
  def make_intra_trie_conns(self,company,pincode): ## need to optimize the conns elsewhere
    company_leaf=self.__get_node(company,Node.COMPANY_NODE)
    pincode_leaf=self.__get_node(pincode,Node.PINCODE_NODE)

    # add skip_trie_conns to both tries
    company_leaf.skip_trie_trans.add(pincode_leaf)
    pincode_leaf.skip_trie_trans.add(company_leaf)

  def optimize_conns_node(self,node:Node):
    if len(node.trans)==0:
      return 
    
    result_set=set()
    for index,next_node in enumerate(node.trans.values()):
      if index==0:
        result_set=next_node.skip_trie_trans
      else:
        result_set=result_set.intersection(next_node.skip_trie_trans)

    for next_node in node.trans.values(): # delete conns from pincode
      next_node.skip_trie_trans=\
        next_node.skip_trie_trans.difference(result_set)

    for company_node,pincode_node in itertools.product(result_set,node.trans.values()): # delete conns from company
      company_node.skip_trie_trans.remove(pincode_node)

    for company_node in result_set:
      company_node.skip_trie_trans.add(node)
    node.skip_trie_trans=node.skip_trie_trans.union(result_set)


  def optimize_conns_dfs(self,pincode_head:Node=None):
    # nodes must be processed post-order
    if not pincode_head:
      pincode_head=self.__set_head_by_type(Node.PINCODE_NODE)
    
    for next_node in pincode_head.trans.values():
      self.optimize_conns_dfs(next_node)

    self.optimize_conns_node(pincode_head) 

  def get_partial_string(self,node:Node):
    ans=""
    cur=node
    while cur:
      ans+=cur.data
      cur=cur.parent
    ans=ans[::-1]
    return ans

  def get_all_subtree_strings(self,node:Node):
    def __DFS(node:Node,starting=False):
      full_list=[]
      for next_node in node.trans.values():
        full_list.extend(__DFS(next_node))

      if starting:
        # return full_list
        return full_list+['']*node.num_word
      else:
        return [node.data+string for string in full_list]\
        +[node.data]*node.num_word

    return __DFS(node,starting=True)

  def get_pincodes(self,company_name):
    if not self.exist_string_in_trie(company_name,Node.COMPANY_NODE):
      return []
    
    company_leaf=self.__get_node(company_name,Node.COMPANY_NODE)
    all_pincodes=[]
    for node in company_leaf.skip_trie_trans:
      pref=self.get_partial_string(node)
      substr_list=self.get_all_subtree_strings(node)

      if len(substr_list)==0: # should not come here anymore
        print("Warning!")
        all_pincodes.append(pref) 
      else:
        all_pincodes.extend(pref+string for string in substr_list)
    
    return all_pincodes
  
  def get_companies(self,pincode):
    if not self.exist_string_in_trie(pincode,Node.PINCODE_NODE):
      return []
    
    pincode_head=self.__set_head_by_type(Node.PINCODE_NODE)
    all_companies=[]
    all_companies.extend(self.get_partial_string(company_node) for company_node in pincode_head.skip_trie_trans)# get from the root node

    for index,i in enumerate(pincode):
      pincode_head=pincode_head.trans[i]
      all_companies.extend(self.get_partial_string(company_node) for company_node in pincode_head.skip_trie_trans)
      
    return all_companies

  def validate_company_pincode(self,company:str,pincode:str):
    if not self.exist_string_in_trie(company,Node.COMPANY_NODE):
      return False
    
    company_leaf=self.__get_node(company,Node.COMPANY_NODE)
    pincode_head=self.pincode_trie_head
    if company_leaf in pincode_head.skip_trie_trans:
      return True
    for i in pincode:
      if pincode_head.trans.get(i) is None:
        break
      pincode_head=pincode_head.trans[i]
      if company_leaf in pincode_head.skip_trie_trans:
        return True
    
    return False

  def __push_skip_conn_down_all(self,node:Node):
    # make sure that this is not called on the leaf at all
    init_set=node.skip_trie_trans
    node.skip_trie_trans=set()
    for company_node in init_set:
      company_node.skip_trie_trans.remove(node)
    
    for next_node in node.trans.values():
      next_node.skip_trie_trans.update(init_set)
      for company_node in init_set:
        company_node.skip_trie_trans.add(next_node)

  def update_add_pincode(self,new_pincode):
    if self.exist_string_in_trie(new_pincode,Node.PINCODE_NODE):
      return 
    pincode_head=self.pincode_trie_head
    self.__push_skip_conn_down_all(pincode_head)

    for i in new_pincode:
      if pincode_head.trans.get(i) is None:
        break
      pincode_head=pincode_head.trans[i]
      self.__push_skip_conn_down_all(pincode_head)
    
    self.add_string_uniq(new_pincode,Node.PINCODE_NODE)
      
  def update_add_company(self,new_company):
    self.add_string_uniq(new_company,Node.COMPANY_NODE)
  
  def __push_skip_conn_up_company(self,pincode_node:Node,company_node:Node):
    cur=pincode_node
    while cur:
      #go up if leaf node
      if len(cur.trans)==0:
        cur=cur.parent
        continue
      exist_all=True
      for next_node in cur.trans.values():
        if company_node not in next_node.skip_trie_trans:
          exist_all=False
          break
      if not exist_all:
        break
      #remove existing conns
      company_node.skip_trie_trans=company_node.skip_trie_trans.difference(cur.trans.values())
      for next_node in cur.trans.values():
        next_node.skip_trie_trans.remove(company_node)
      #add new conns
      company_node.skip_trie_trans.add(cur)
      cur.skip_trie_trans.add(company_node)
      #go up
      cur=cur.parent

  def update_add_company_pincode(self,new_company,new_pincode):
    self.update_add_pincode(new_pincode)
    self.update_add_company(new_company)

    self.make_intra_trie_conns(new_company,new_pincode)
    self.__push_skip_conn_up_company(self.__get_node(new_pincode,Node.PINCODE_NODE),
                              self.__get_node(new_company,Node.COMPANY_NODE))

  def __push_skip_conn_down_company(self,pincode_node:Node,company_leaf:Node):
    # if called on leaf node, will leak out the connection

    if company_leaf not in pincode_node.skip_trie_trans:
      return 
    #delete old conns
    pincode_node.skip_trie_trans.remove(company_leaf)
    company_leaf.skip_trie_trans.remove(pincode_node)
    #add new conns
    for next_node in pincode_node.trans.values():
      next_node.skip_trie_trans.add(company_leaf)
    company_leaf.skip_trie_trans.update(pincode_node.trans.values()) 

  def __delete_companyleaf_from_trie(self,company_node):
    company_node.num_word=0    
    while len(company_node.trans)==0 \
      and company_node.num_word==0:

      __temp_data=company_node.data
      company_node=company_node.parent
      if not company_node:
        break
      del company_node.trans[__temp_data]


  def update_remove_company_pincode(self,old_company,old_pincode):
    if not self.validate_company_pincode(old_company,old_pincode):
      return 
    
    pincode_head=self.pincode_trie_head
    company_leaf=self.__get_node(old_company,Node.COMPANY_NODE)
    for i in old_pincode:
      self.__push_skip_conn_down_company(pincode_head,company_leaf)
      pincode_head=pincode_head.trans[i]
    
    #this push down will delete the conn
    self.__push_skip_conn_down_company(pincode_head,company_leaf)

    #delete the company if all conns gone
    if len(company_leaf.skip_trie_trans)==0:
      self.__delete_companyleaf_from_trie(company_leaf)

    #don't delete the pincode yet
 
  
def load_drie_from_file():
    
    client = storage.Client()
    bucket = client.bucket(bucket_name)
    blob = bucket.blob(blob_name)
    blob.download_to_filename(file_path)

    try:
        with open(file_path, 'rb') as file:
            drie = pickle.load(file)
        return drie, None
    except Exception as e:
        return None, str(e)


def upload_to_gcs(bucket_name, blob_name, data):
    client = storage.Client()
    bucket = client.get_bucket(bucket_name)
    blob = bucket.blob(blob_name)
    blob.upload_from_string(data)

def get_companies_for_list(double_trie, pincode_list):
    all_companies = {}
    string_list = [str(integer) for integer in pincode_list]
    for pincode in string_list:
        pincodes = double_trie.get_companies(pincode)
        all_companies[pincode] = pincodes
    return all_companies

def add_cors_headers(response):
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Methods", "GET, PUT, DELETE")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type")
    return response

def process_drie_request(request):
    
    company = request.args.get("company")
    

    if request.method == 'GET':
        drie, error = load_drie_from_file()
        if error:
          return {"error": error}, 500
    
        if drie is None:
          return {"error": "Error loading Double Trie Data Structure"}, 500
    
        pincode_list = request.args.getlist("pincodeList")
        resp_dict = {}
        if company:
          pincode = request.args.get("pincode")
          if pincode:
            resp_dict["exists"] = drie.validate_company_pincode(company, pincode)
          else:
            resp_dict["pincodes"] = drie.get_pincodes(company)
        elif pincode_list:
            pincode_str=pincode_list[0]
            pincode_list = [int(pincode) for pincode in pincode_str.split(',')]
            resp=str(pincode_list)+str(len(pincode_list))+str(type(pincode_list))
            # return resp,200
            resp_dict['companies'] = get_companies_for_list(drie, pincode_list)
        
        return add_cors_headers(jsonify(resp_dict)), 200
    
    elif request.method == "PUT":
        drie, error = load_drie_from_file()
        if error:
          return {"error": error}, 500
    
        if drie is None:
          return {"error": "Error loading Double Trie Data Structure"}, 500
    
        pincode = request.args.get("pincode")
        if company and pincode:
            drie.update_add_company_pincode(company, pincode)
            serialized_drie = pickle.dumps(drie)
            upload_to_gcs(bucket_name, blob_name, serialized_drie)
            return add_cors_headers(jsonify({"message": f"Added {company} {pincode} pair"})), 200
        else:
            return {"error": "Both company and pincode are required for PUT request"}, 405

    elif request.method == "DELETE":
        pincode = request.args.get("pincode")
        drie, error = load_drie_from_file()
        if company and pincode:
            drie.update_remove_company_pincode(company, pincode)
            serialized_drie = pickle.dumps(drie)
            upload_to_gcs(bucket_name, blob_name, serialized_drie)
            return add_cors_headers(jsonify({"message": f"Deleted {company} {pincode} pair"})), 200
        else:
            return add_cors_headers(jsonify({"error": "Unsupported method"})), 405

    else:
        return add_cors_headers(jsonify({"error": "Unsupported method"})), 405