CREATE EXTENSION "uuid-ossp";

CREATE TYPE presentation_type AS ENUM ('.pdf', '.pptx');

CREATE TABLE presentation (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  number_of_slides SMALLINT NOT NULL,
  current_slide SMALLINT NOT NULL,
  file_name VARCHAR(14) NOT NULL,
  file_type presentation_type NOT NULL
);

-- todo create triggers
