# Quiz Data Structure

This folder contains the quiz level data for the Harley Circus inside joke quiz game.

## File Format

All quiz levels are stored as JSON files with the naming convention `level{N}.json` where N is the level number (starting from 0).

## Data Structure

Each level file contains:

- **level**: Level number (integer)
- **title**: Display title for the level
- **description**: Brief description of the level
- **estimatedTime**: Expected time to complete (string)
- **difficulty**: Difficulty level (string)
- **theme**: Theme or category (string)
- **questions**: Array of quiz questions
- **bonus_round**: Optional bonus round configuration
- **completion_message**: Message shown when level is completed
- **total_points**: Maximum possible points
- **unlock_requirement**: Requirements to unlock this level

## Question Structure

Each question contains:

- **id**: Unique question identifier
- **type**: Question type (riddle, emoji_sequence, reference_hunt, etc.)
- **question**: The question text
- **hint**: Optional hint text
- **options**: Array of answer options
- **correct_answer**: Index of correct answer (0-based)
- **explanation**: Explanation of the correct answer
- **timeLimit**: Time limit in seconds
- **points**: Points awarded for correct answer

## Current Levels

- **level0.json**: Demo level with time-consuming inside jokes and references
- Additional levels can be added following the same structure

## Usage

The quiz service (`src/services/quizService.ts`) handles loading and caching of level data. Levels are loaded dynamically as needed.
