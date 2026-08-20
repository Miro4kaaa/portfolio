import urllib.request
import os

icons = {
    "analysis": "https://raw.githubusercontent.com/tabler/tabler-icons/master/icons/chart-bar.svg",
    "brain": "https://raw.githubusercontent.com/tabler/tabler-icons/master/icons/brain.svg",
    "target": "https://raw.githubusercontent.com/tabler/tabler-icons/master/icons/target-arrow.svg",
    "rocket": "https://raw.githubusercontent.com/tabler/tabler-icons/master/icons/rocket.svg"
}

os.makedirs("images/icons", exist_ok=True)

for name, url in icons.items():
    try:
        urllib.request.urlretrieve(url, f"images/icons/{name}.svg")
        print(f"Downloaded {name}.svg")
    except Exception as e:
        print(f"Failed {name}: {e}")
