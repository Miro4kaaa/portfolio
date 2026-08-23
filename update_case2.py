import re

with open("case2.html", "r", encoding="utf-8") as f:
    html = f.read()

def create_wrapper(filename, t=1):
    return f"""            <div class="video-wrapper">
                <video src="images/Видео-креативы/{filename}" preload="metadata" data-preview-time="{t}"></video>
                <div class="play-icon">
                    <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                </div>
            </div>"""

new_grid = "\n".join([
    create_wrapper("Virdeliya.mp4", 2),
    create_wrapper("1 episode.mp4", 1),
    create_wrapper("2 episode.mp4", 10),
    create_wrapper("3 episode.mp4", 1),
    create_wrapper("Virdeliya episode 4.mp4", 1),
    create_wrapper("cyber fashion.mp4", 1),
    create_wrapper("nike.mp4", 1),
    create_wrapper("royal_canin_prob4.mp4", 1),
    create_wrapper("Model_walking_in_luxury_sneakers_202608102001.mp4", 1),
    create_wrapper("video_AI_wowsocks_unicorn_3.mp4", 1),
    create_wrapper("video_ai_ginger_cat_pan_line.mp4", 1),
    create_wrapper("video_banner_pan_ai_3.mp4", 1),
    create_wrapper("video_pan_line_ai.mp4", 1),
    create_wrapper("video_photoframes_ai.mp4", 1),
    create_wrapper("1013.mp4", 1),
    create_wrapper("1016.mp4", 1),
])

# replace the content inside video-grid-5
grid_match = re.search(r'(<div class="video-grid-5">)(.*?)(</div>\s*<div style="max-width: 1400px;)', html, flags=re.DOTALL)
if grid_match:
    html = html[:grid_match.start(2)] + "\n" + new_grid + "\n        " + html[grid_match.start(3):]
    with open("case2.html", "w", encoding="utf-8") as f:
        f.write(html)
    print("Replaced video grid")
else:
    print("Could not find video grid")
