"""Regenerate assets/js/bot-model-data.js from the GLB source file."""
import base64
import os

glb_path = os.path.join('assets', 'models', 'archer_shooting_arrow_from_bow_in_battle.glb')
out_path = os.path.join('assets', 'js', 'bot-model-data.js')

with open(glb_path, 'rb') as f:
    data = f.read()

b64 = base64.b64encode(data).decode('ascii')
content = (
    '/* Embedded GLB for offline / static hosting (no server required) */\n'
    'window.BOT_MODEL_DATA_URI = "data:model/gltf-binary;base64,' + b64 + '";\n'
)

with open(out_path, 'w', encoding='utf-8') as f:
    f.write(content)

print('Wrote', out_path)
