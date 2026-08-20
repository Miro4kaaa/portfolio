import urllib.request
import re
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

links = {
    "1 episode": "https://kinescope.io/byPJiou8T9eeTx46k3T8XZ/plG24Zw8",
    "2 episode": "https://kinescope.io/fwkP3nKhjh79QorEhz8ZaT",
    "1013": "https://kinescope.io/0C9xXgm3fALRzDA8Ky6k25/pltwspkq",
    "1016": "https://kinescope.io/s7ASdN1x5DLuEf4DZqJGvU/plJIgoDG",
    "cyber fashion": "https://kinescope.io/g4xcEzpsTYCdYywQapDPhU",
    "Model_walking_in_luxury_sneakers_202608102001": "https://kinescope.io/gdndEbtAttbrPWxqe378D9/plNujaml",
    "nike": "https://kinescope.io/uRZABcXxNRmcZeH4NiVD5n/plL2PtJ3",
    "preview_provans": "https://kinescope.io/55tX8JzUftYA5SWbB2hko1/plPXGoWB",
    "preview_scotch_3M_8mm_5m_x10": "https://kinescope.io/e3R1Ja6zNnA6a266Pu6VS7/pldeIbdN",
    "preview_traf_pan_5025p8_line3_sonoma_bl": "https://kinescope.io/bjpCqgvSsmXfwbWJqfjYBM/pl4S3mAB",
    "preview_traf_pan_5025x5012_antr": "https://kinescope.io/oPLWLjxCK8rJioY6DPYja9/plCmbatN",
    "preview_vanessa": "https://kinescope.io/3Ch4Fh3THoWUTq19pN2dY2",
    "reklama_trafaretovo": "https://kinescope.io/d7pnUNWdRwNarAYLSdbPkf/plTVDqgP",
    "royal_canin_prob4": "https://kinescope.io/fU9a3qaZTVNwx9UiFMgoAL",
    "video_ai_ginger_cat_pan_line": "https://kinescope.io/8krf2gMjxi6BQehawqVg71/plRivogX",
    "video_AI_wowsocks_unicorn_2": "https://kinescope.io/dmBNoBwFS73vYEj21H1Z7w/plLY2kiC",
    "video_AI_wowsocks_unicorn_3": "https://kinescope.io/hAz1SzsSZpn1W37vU9ef9r/plABfxJC",
    "video_banner_pan_ai_3": "https://kinescope.io/kPwwTkoKzRm3HV5u29eKom/pl2No87r",
    "video_pan_line_ai": "https://kinescope.io/hkjF9xLMsXhnem3xC7nggW",
    "video_photoframes_ai": "https://kinescope.io/8XT5MAT9zMuBvB16nQjDM2/pl4JSuDz",
    "Virdeliya": "https://kinescope.io/4QpuPNqqkS3dkd9YebhVzz/plAc86Ey"
}

embed_links = {}

for name, url in links.items():
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        html = urllib.request.urlopen(req, context=ctx).read().decode("utf-8")
        match = re.search(r'<meta property="og:video:iframe" content="(.*?)"', html)
        if match:
            embed_links[name] = match.group(1)
            print(f"Found {name}: {embed_links[name]}")
        else:
            print(f"No embed link found for {name}")
    except Exception as e:
        print(f"Error fetching {name}: {e}")

# Read case2.html
with open('case2.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace wrong player links with correct embed links
for name, old_url in links.items():
    wrong_url = old_url.replace("https://kinescope.io/", "https://player.kinescope.io/")
    if name in embed_links:
        content = content.replace(wrong_url, embed_links[name])

with open('case2.html', 'w', encoding='utf-8') as f:
    f.write(content)

# Update projects.html
with open('projects.html', 'r', encoding='utf-8') as f:
    p_content = f.read()

for name, old_url in links.items():
    wrong_url = old_url.replace("https://kinescope.io/", "https://player.kinescope.io/")
    if name in embed_links:
        p_content = p_content.replace(wrong_url, embed_links[name])

with open('projects.html', 'w', encoding='utf-8') as f:
    f.write(p_content)

print("Replacement complete.")
