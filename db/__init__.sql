CREATE EXTENSION "uuid-ossp";

CREATE TABLE presentation (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  number_of_slides SMALLINT NOT NULL,
  current_slide SMALLINT NOT NULL,
  file_name VARCHAR(10) NOT NULL
);

-- todo create triggers
