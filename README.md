# ONDC_PincodeServiceability

## To run the cloud function code, be sure to put the bucket_name and blob_name properties inside the cloud functions which we have replaced with dummy values.  

# Idea behind the algorithm
As fast retrieval is the main importance in this problem, we came up with the idea of a trie-based custom data structure: Double Trie. Trie is chosen here due to the fast lookup and efficient updation characteristic of the tries.

In this data structure, we keep 2 tries(1 for pincodes and 1 for the merchants). The pincode trie is a fixed-length trie(6 length for any branch). Now, we join the leaf nodes(nodes where the merchant identifier ends) of the merchant trie with the corresponding nodes of the pincode trie.

Here, the basic approach is to join with the pincode trie's leaf nodes but there is an interesting clustering characteristic of the pincodes. Nearby areas have pincodes that only differ in the later digits, therefore in the trie, the pincodes in proximity come under a smaller subtree. This means that a lot of the merchants deliver in areas with proximal pincodes. Therefore, here we pick out the lowest common ancestor node of the pincode trie for a given merchant and connect the merchant's leaf node with that node. Doing this reduces the number of connections between the 2 tries, bringing down space requirements and making the fetching process faster. 


**Format Of The Input File-**
It must be a .txt file.
The first line should contain the number of inputs.
Each input is in the format -> Company Name, Pincode it serves. Example- TJTCNCUBI,378279

We can also have some queries after this. The following line would be the number of queries.
Each query is in the format Operation,Company,Pincode
The query can be one of the following - 
1. ADD,COMPANY,PINCODE- Adds the company and Pincode Node. Ex- ADD,JTOWY,276131
2. REMOVE,COMPANY,PINCODE- Removes the company and Pincode Node. Ex- REMOVE,DUXCSVB,906664
3. PRINT,PIN,PINCODE- Prints the companies serviceable in the Pincode field. Ex- PRINT,PIN,614599
4. PRINT,COMPANY,company_name- Prints the pincodes serviceable in the company_name field. Ex- PRINT,COMPANY,DVUGWTNT

So a while input may look like this-
```
<number of company pincode inputs>
.
.
.
company pincode inputs
.
.
.
<number of queries>
.
.
.
queries
.
.
.
```
For example, see the file below:
```
5
PVTPPE,846912
PVTPPE,846913
PVTPPE,754013
TJTCNCUBI,378258
TJTCNCUBI,378259
3
REMOVE,TJTCNCUBI,378259
PRINT,COMPANY,TJTCNCUBI
PRINT,PIN,846913
```

### Testing Instructions
In the test_cases folder, there are 2 subfolders. The "Simple without changes" folder contains files with dummy data but no update or print query. The file can be loaded into the Drie and then manual queries can be fired by the user.
On the other hand, the "WIth update,remove,add etc" folder contains files with both some initial data and update/print queries. They come paired with a corresponding "answer_" prefixed file that contains the results of the queries. In the main section of the drie, a code is written that takes input of the test file and runs the check. 

To run those tests, follow these steps:
1. git clone the repository and cd to the repo.
2. run command on shell like: `python Algorithm/main.py "test_cases/WIth update,remove,add etc/sample_input_addremoveupdate.txt"`
   
### Benefits:
  * Decreases space requirement.
  * Enhances fetching speed.
  * Very optimal for querying pincode,company pairs. [**O(|company_name|+|pincode|)**]
  * Clusters the nearby pincodes efficiently.
  * Handles insertion/deletion updates very efficiently


Below is a diagram of an example for this problem.
![Heavy PLanning](https://github.com/kabirrajsingh/ondc_pincodeServiceability/assets/46425134/eb17dec9-9235-4e18-a62b-81194800f550)
