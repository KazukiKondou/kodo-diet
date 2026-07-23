import { describe, it, expect } from "vitest"
import { youtubeId, isYoutube, youtubeThumbnail, countByVideo } from "@/lib/video"

describe("youtubeId", () => {
  it("各種URL形式からIDを抽出する", () => {
    expect(youtubeId("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ")
    expect(youtubeId("https://youtu.be/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ")
    expect(youtubeId("https://www.youtube.com/shorts/abc123XYZ")).toBe("abc123XYZ")
    expect(youtubeId("https://youtube.com/embed/abc123XYZ")).toBe("abc123XYZ")
  })
  it("非YouTubeはnull", () => {
    expect(youtubeId("https://example.com/video")).toBeNull()
    expect(youtubeId("not-a-url")).toBeNull()
  })
})

describe("isYoutube / thumbnail", () => {
  it("判定とサムネURL", () => {
    expect(isYoutube("https://youtu.be/xyz")).toBe(true)
    expect(youtubeThumbnail("https://youtu.be/xyz")).toBe("https://i.ytimg.com/vi/xyz/hqdefault.jpg")
    expect(youtubeThumbnail("https://example.com")).toBeNull()
  })
})

describe("countByVideo", () => {
  it("videoId別の件数を集計、nullは無視", () => {
    const logs = [
      { videoId: "v1" },
      { videoId: "v1" },
      { videoId: "v2" },
      { videoId: null },
    ]
    expect(countByVideo(logs)).toEqual({ v1: 2, v2: 1 })
  })
})
