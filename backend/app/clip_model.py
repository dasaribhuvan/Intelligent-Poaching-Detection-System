import torch
import clip
from PIL import Image
import cv2
import numpy as np

device = "cpu"

model, preprocess = clip.load("ViT-B/32", device=device)

poacher_prompts = [
    "a poacher illegally hunting wildlife",
    "illegal hunter with rifle",
    "person shooting wild animal",
    "hunter targeting endangered animal",
]

ranger_prompts = [
    "wildlife ranger protecting animals",
    "park ranger monitoring wildlife",
    "forest ranger on patrol",
    "conservation officer protecting animals",
]

all_prompts = poacher_prompts + ranger_prompts
text_tokens = clip.tokenize(all_prompts).to(device)


def classify_person(image_crop):

    try:

        # ---------- uniform detection (fast heuristic) ----------
        hsv = cv2.cvtColor(image_crop, cv2.COLOR_BGR2HSV)

        green_mask = cv2.inRange(
            hsv,
            np.array([35, 40, 40]),
            np.array([85, 255, 255])
        )

        green_ratio = np.sum(green_mask > 0) / (image_crop.shape[0] * image_crop.shape[1])

        if green_ratio > 0.35:
            return "ranger", 0.9

        # ---------- CLIP ----------
        image_crop = cv2.resize(image_crop, (224,224))

        image = Image.fromarray(cv2.cvtColor(image_crop, cv2.COLOR_BGR2RGB))

        image_input = preprocess(image).unsqueeze(0).to(device)

        with torch.no_grad():

            logits_per_image, _ = model(image_input, text_tokens)

            probs = logits_per_image.softmax(dim=-1).cpu().numpy()[0]

        poacher_score = np.mean(probs[:len(poacher_prompts)])
        ranger_score = np.mean(probs[len(poacher_prompts):])

        if poacher_score > ranger_score:
            return "poacher", float(poacher_score)

        return "ranger", float(ranger_score)

    except Exception as e:

        print("CLIP error:", e)

        return "person", 0.5