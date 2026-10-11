-- ==========================================================
-- University Research Opportunity Portal - Seed Data
-- ==========================================================

USE research_portal;

INSERT INTO opportunities (title, description, research_area, faculty_name, department, required_skills, available_positions, application_deadline, status)
VALUES
(
    'Deep Learning for Medical Image Segmentation',
    'Investigating transformer-based vision architectures for MRI and CT scan segmentation with clinical validation.',
    'Artificial Intelligence & Computer Vision',
    'Dr. Tariq Khan',
    'Computer Science',
    'Python, PyTorch, OpenCV, MONAI, Git',
    3,
    '2026-11-30',
    'Open'
),
(
    'Post-Quantum Cryptography in Edge IoT Networks',
    'Design and bench-testing of lightweight lattice-based cryptographic algorithms on constrained microcontrollers.',
    'Cybersecurity & Network Security',
    'Dr. Ayesha Siddiqa',
    'Computer Science',
    'C/C++, Cryptography, Wireshark, ESP32, Linux',
    2,
    '2026-11-15',
    'Open'
),
(
    'Multimodal Urdu Speech-to-Text with Whisper',
    'Fine-tuning Whisper and wav2vec models on low-resource regional dialects of Pashto and Urdu for public health kiosks.',
    'Natural Language Processing',
    'Dr. Muhammad Ali',
    'Software Engineering',
    'Python, HuggingFace, Audio Processing, Transformers',
    4,
    '2026-10-31',
    'Open'
),
(
    'Energy-Efficient Scheduling in Cloud Data Centers',
    'Developing reinforcement learning heuristics for virtual machine consolidation and carbon reduction in data centers.',
    'Distributed & Cloud Computing',
    'Dr. Farhan Zeb',
    'Computer Science',
    'Java, Python, CloudSim, Reinforcement Learning',
    1,
    '2026-09-30',
    'Closed'
);
