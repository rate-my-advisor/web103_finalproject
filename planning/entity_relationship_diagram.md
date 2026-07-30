# Entity Relationship Diagram

Reference the Creating an Entity Relationship Diagram final project guide in the course portal for more information about how to complete this deliverable.

## Create the List of Tables

[👉🏾👉🏾👉🏾 List each table in your diagram]

## Add the Entity Relationship Diagram
Open on Mermaid.md: https://mermaid.ai/d/03af1967-7ba9-439b-b1a0-5bc85e05f239
erDiagram

    UNIVERSITY ||--o{ ADVISOR : has
    ADVISOR ||--o{ REVIEW : receives
    STUDENT ||--o{ REVIEW : writes

    UNIVERSITY {
        int university_id PK
        string name
        string Department
    }

    ADVISOR {
        int advisor_id PK
        int university_id FK
        string first_name
        string last_name
        string email
        string office
    }

    STUDENT {
        int student_id PK
        string username
        string major
        int graduation_year
    }

    REVIEW {
        int review_id PK
        int advisor_id FK
        int student_id FK
        int overall_rating
        int communication_rating
        int availability_rating
        string comment
        boolean would_recommend
        date review_date
    }

[👉🏾👉🏾👉🏾 Include an image or images of the diagram below. You may also wish to use the following markdown syntax to outline each table, as per your preference.]

![Entity Relationship Diagram](images/ERD.png)

| Column Name | Type | Description |
|-------------|------|-------------|
| id | integer | primary key |
| name | text | name of the shoe model |
| ... | ... | ... |
