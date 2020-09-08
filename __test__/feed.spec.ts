import { iOSFeed } from "../src/feed/feed"

describe("test feed tool",()=>{
  it("test readfolder",async ()=>{
    const fed = new iOSFeed();
    fed.readFromPath('./inputfiles/iOSOrignal')
  })  
})