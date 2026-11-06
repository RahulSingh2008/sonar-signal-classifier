[project_readme.md](project_readme.md)

# 🔱 Sonar Rock vs Mine: From Raw Sonar Signals to a Reliable Classifier

> **<Hackathon ML-hackathon> | 24-Hour Live Hackathon | Machine Learning & Signal Classification**
>
> *Developed for <College / Event> Hackathon Challenge*

![Python](https://img.shields.io/badge/Python-3.10.11-3776AB?style=flat-square)
![scikit-learn](https://img.shields.io/badge/scikit--learn-1.4.2-F7931E?style=flat-square)
![Flask](https://img.shields.io/badge/Flask-3.0.3-000000?style=flat-square)
![Dataset](https://img.shields.io/badge/Dataset-UCI%20Sonar-2E8B57?style=flat-square)
![Hardware](https://img.shields.io/badge/Hardware-<your%20CPU%2FGPU>-76B900?style=flat-square)
![Platform](https://img.shields.io/badge/Platform-Windows%20OS-0078D6?style=flat-square)

## 1. Objective
This project builds a machine learning system that classifies sonar returns as either a Rock (R) or a Mine (M). Sonar echoes from a metal cylinder and a similarly shaped rock differ only subtly, and the signal is noisy and high-dimensional (60 frequency-band features), so manual interpretation needs trained experts and is slow. Our goal is to automate this decision with a model that is accurate, explainable, and reproducible.

The system trains and compares several algorithms on the UCI Sonar dataset, evaluates them on held-out data, and saves the final pipeline. A web interface lets a user enter new readings and get a prediction with a confidence score. Because a missed mine is more dangerous than a false alarm, we also pay particular attention to recall on the Mine class.

# Sonar Rock vs Mine Prediction

Machine learning classifier that predicts whether a sonar return comes from a
**Rock (R)** or a **Mine (M)**, with a web interface for new predictions.

## 1. Objective
One or two sentences: what problem you solve and why a missed mine matters
more than a false alarm.

## 2. Dataset
- UCI Connectionist Bench (Sonar, Mines vs. Rocks)
- 208 samples (111 Mine, 97 Rock), 60 features (energy per frequency band, 0.0 to 1.0)
- Source: <link to UCI or Kaggle>. No other datasets were used.
