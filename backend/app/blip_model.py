import torch
from PIL import Image
from transformers import BlipProcessor, BlipForConditionalGeneration

device = "cpu"

processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")

model = BlipForConditionalGeneration.from_pretrained(
    "Salesforce/blip-image-captioning-base"
).to(device)


def understand_scene(image):

    image = Image.fromarray(image)

    inputs = processor(image, return_tensors="pt")

    with torch.no_grad():
        out = model.generate(**inputs, max_new_tokens=25)

    caption = processor.decode(out[0], skip_special_tokens=True)

    return caption.lower()