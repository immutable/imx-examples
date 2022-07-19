tokenId=28007
for i in {1..5};
do
    export TOKEN_ID=$(($tokenId + (1000*i))) && npm run bulk-mint -- -n 2000 -w 0xE9B00a87700f660e46b6F5DEAa1232836bCc07D3
done


