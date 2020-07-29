CREATE EXTENSION "uuid-ossp";

CREATE OR REPLACE FUNCTION public.notify_event()
  RETURNS trigger
  LANGUAGE plpgsql
AS $function$
BEGIN
  PERFORM pg_notify('new_event', row_to_json(NEW)::text);
  RETURN NULL;
END;
$function$;

CREATE TABLE public.presentation (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  number_of_slides SMALLINT NOT NULL,
  current_slide SMALLINT NOT NULL CHECK (current_slide >= 1),
  file_name VARCHAR(14) NOT NULL,
  CHECK (current_slide <= number_of_slides)
);

CREATE TRIGGER update_presentation AFTER UPDATE
ON presentation
FOR EACH ROW EXECUTE PROCEDURE notify_event();
