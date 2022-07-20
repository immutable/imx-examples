tokenId=29000
foo=10000
for i in {1..10};
do
    npm run bulk-mint -- -n 1 -w 0xE9B00a87700f660e46b6F5DEAa1232836bCc07D3 -t $(($tokenId + i)) &
    npm run bulk-mint -- -n 1 -w 0xE9B00a87700f660e46b6F5DEAa1232836bCc07D3 -t $(($tokenId + ($foo) + i)) &
    npm run bulk-mint -- -n 1 -w 0xE9B00a87700f660e46b6F5DEAa1232836bCc07D3 -t $(($tokenId + ($foo*2) + i)) &
    npm run bulk-mint -- -n 1 -w 0xE9B00a87700f660e46b6F5DEAa1232836bCc07D3 -t $(($tokenId + ($foo*3) + i)) &
    npm run bulk-mint -- -n 1 -w 0xE9B00a87700f660e46b6F5DEAa1232836bCc07D3 -t $(($tokenId + ($foo*4) + i)) &
    npm run bulk-mint -- -n 1 -w 0xE9B00a87700f660e46b6F5DEAa1232836bCc07D3 -t $(($tokenId + ($foo*5) + i)) &
    npm run bulk-mint -- -n 1 -w 0xE9B00a87700f660e46b6F5DEAa1232836bCc07D3 -t $(($tokenId + ($foo*6) + i)) &
    npm run bulk-mint -- -n 1 -w 0xE9B00a87700f660e46b6F5DEAa1232836bCc07D3 -t $(($tokenId + ($foo*7) + i)) &
    npm run bulk-mint -- -n 1 -w 0xE9B00a87700f660e46b6F5DEAa1232836bCc07D3 -t $(($tokenId + ($foo*8) + i)) &
    npm run bulk-mint -- -n 1 -w 0xE9B00a87700f660e46b6F5DEAa1232836bCc07D3 -t $(($tokenId + ($foo*9) + i)) &
done


