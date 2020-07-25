export enum Table {
  Presentation = 'public.presentation',
}

export interface PresentationDbRow {
  id: string;
  number_of_slides: number;
  current_slide: number;
  file_name: string;
}
