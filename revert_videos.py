import re
import os

# 1. Update case2.html
with open('case2.html', 'r', encoding='utf-8') as f:
    content = f.read()

# mapping from iframe URL to local MP4 name
mapping = {
    "1f0d98f3-3422-44c7-b089-8c656f152a4f": "Virdeliya.mp4",
    "79f78a22-39dd-48fa-9837-9acacd67ab48": "cyber fashion.mp4",
    "e9bad28a-2265-40bd-83cb-c09c53722689": "nike.mp4",
    "78a7a4be-213f-4a26-8b03-7228c19ebac0": "royal_canin_prob4.mp4",
    "559099f9-f40e-433c-a789-7e78a20e9b63": "1 episode.mp4",
    "759c769d-0993-42bf-94a2-802088674969": "2 episode.mp4",
    "7b3314d3-4552-4c6b-bc9f-5160166d1016": "Model_walking_in_luxury_sneakers_202608102001.mp4",
    "6212889a-10f8-4e64-9955-35d0a8cb6888": "reklama_trafaretovo.mp4",
    "3b66a875-0672-4f5e-91fc-92081305c440": "video_ai_ginger_cat_pan_line.mp4",
    "640e9a0c-091c-4733-85d0-35a40fd0a34e": "video_AI_wowsocks_unicorn_2.mp4",
    "8665da5c-c2aa-4406-be6f-8c114c54e529": "video_AI_wowsocks_unicorn_3.mp4",
    "a0806876-1cfb-43b7-ba57-79c79c0a1c44": "video_banner_pan_ai_3.mp4",
    "8444dbea-0511-4653-98cb-1ba09db587a0": "video_pan_line_ai.mp4",
    "407d5bd3-3fb6-48c6-b758-b49da130b097": "video_photoframes_ai.mp4",
    "050c0b9f-bc69-46ee-a517-1fb33f39d452": "1013.mp4",
    "d3798dfc-aca0-4a98-9e4f-616a53bb19d6": "1016.mp4"
}

preview_times = {
    "Virdeliya.mp4": "2",
    "cyber fashion.mp4": "1",
    "nike.mp4": "1",
    "royal_canin_prob4.mp4": "1",
    "1 episode.mp4": "1",
    "2 episode.mp4": "10",
    "Model_walking_in_luxury_sneakers_202608102001.mp4": "1",
    "reklama_trafaretovo.mp4": "1",
    "video_AI_wowsocks_unicorn_2.mp4": "1",
    "video_AI_wowsocks_unicorn_3.mp4": "1",
    "video_ai_ginger_cat_pan_line.mp4": "1",
    "video_pan_line_ai.mp4": "1",
    "video_photoframes_ai.mp4": "1",
    "1013.mp4": "1",
    "1016.mp4": "1"
}

# Remove the wrapper div and iframe, replace with <video>
def replace_thumb(match):
    full_str = match.group(0)
    for uuid, filename in mapping.items():
        if uuid in full_str:
            if "banner" in filename:
                return f'<video src="images/Видео-креативы/{filename}" class="banner-video" autoplay loop muted playsinline></video>'
            else:
                ptime = preview_times.get(filename, "1")
                return f'<video src="images/Видео-креативы/{filename}" preload="metadata" data-preview-time="{ptime}"></video>'
    return full_str

content = re.sub(r'<div class="video-thumb"[^>]*>.*?</div>\s*</div>', replace_thumb, content, flags=re.DOTALL)
# some divs might not be matched perfectly, let's just do a simpler replace
# Actually, it's easier to recreate the grid since the order is known.
grid_videos = [
    "Virdeliya.mp4", "cyber fashion.mp4", "nike.mp4", "royal_canin_prob4.mp4",
    "1 episode.mp4", "2 episode.mp4", "Model_walking_in_luxury_sneakers_202608102001.mp4",
    "reklama_trafaretovo.mp4", "video_AI_wowsocks_unicorn_2.mp4", "video_AI_wowsocks_unicorn_3.mp4",
    "video_ai_ginger_cat_pan_line.mp4", "video_pan_line_ai.mp4", "video_photoframes_ai.mp4",
    "1013.mp4", "1016.mp4"
]

grid_html = '<div class="video-grid-5">\n'
for v in grid_videos:
    ptime = preview_times.get(v, "1")
    grid_html += f'            <video src="images/Видео-креативы/{v}" preload="metadata" data-preview-time="{ptime}"></video>\n'
grid_html += '        </div>'

content = re.sub(r'<div class="video-grid-5">.*?</div>\s*<div class="banner-video"', 
                 grid_html + '\n        <div class="banner-video"', content, flags=re.DOTALL)

# replace the banner div with video
content = re.sub(r'<div class="banner-video">.*?</div>\s*</div>', 
                 '<video src="images/Видео-креативы/video_banner_pan_ai_3.mp4" class="banner-video" autoplay loop muted playsinline></video>', 
                 content, flags=re.DOTALL)

with open('case2.html', 'w', encoding='utf-8') as f:
    f.write(content)


# 2. Update projects.html
with open('projects.html', 'r', encoding='utf-8') as f:
    p_content = f.read()

p_content = re.sub(r'<iframe src="https://kinescope.io/embed/1f0d98f3-3422-44c7-b089-8c656f152a4f[^>]+></iframe>',
                   '<video src="images/Видео-креативы/Virdeliya.mp4" autoplay loop muted playsinline style="width:100%;height:100%;object-fit:cover;display:block;"></video>',
                   p_content)

with open('projects.html', 'w', encoding='utf-8') as f:
    f.write(p_content)

print("Reverted to local video tags.")
