# ONDC_PincodeServiceability

## To run the cloud function code, be sure to put the bucket_name and blob_name properties inside the cloud functions which we have replaced with dummy values.  

# Idea behind the algorithm
As fast retrieval is the main importance in this problem, we came up with the idea of a trie-based custom data structure: Double Trie. Trie is chosen here due to the fast lookup and efficient updation characteristic of the tries.

In this data structure, we keep 2 tries(1 for pincodes and 1 for the merchants). The pincode trie is a fixed-length trie(6 length for any branch). Now, we join the leaf nodes(nodes where the merchant identifier ends) of the merchant trie with the corresponding nodes of the pincode trie.

Here, the basic approach is to join with the pincode trie's leaf nodes but there is an interesting clustering characteristic of the pincodes. Nearby areas have pincodes that only differ in the later digits, therefore in the trie, the pincodes in proximity come under a smaller subtree. This means that a lot of the merchants deliver in areas with proximal pincodes. Therefore, here we pick out the lowest common ancestor node of the pincode trie for a given merchant and connect the merchant's leaf node with that node. Doing this reduces the number of connections between the 2 tries, bringing down space requirements and making the fetching process faster. 

### Benefits:
  * Decreases space requirement.
  * Enhances fetching speed.
  * Very optimal for querying pincode,company pairs. [**O(|company_name|+|pincode|)**]
  * Clusters the nearby pincodes efficiently.
  * Handles insertion/deletion updates very efficiently


Below is a diagram of an example for this problem.
![Heavy PLanning](https://github.com/kabirrajsingh/ondc_pincodeServiceability/assets/46425134/eb17dec9-9235-4e18-a62b-81194800f550)
