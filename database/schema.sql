-- ==========================================================
-- University Research Opportunity Portal - Database Schema
-- Assignment #01: CN - FAST Peshawar
-- Database: MySQL
-- ==========================================================

-- 1. Create the database if it does not exist
CREATE DATABASE IF NOT EXISTS research_portal
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE research_portal;

-- 2. Create the research opportunities table
CREATE TABLE IF NOT EXISTS opportunities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    research_area VARCHAR(255) NOT NULL,
    faculty_name VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    required_skills TEXT NOT NULL,
    available_positions INT NOT NULL CHECK (available_positions > 0),
    application_deadline DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'Closed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_research_area (research_area),
    INDEX idx_department (department)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
