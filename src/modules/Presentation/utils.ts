import { Presentation, PresentationDbRow } from './types';

export const mapPresentationToDbEntity = (
  presentation: Presentation,
): Partial<PresentationDbRow> => ({
  number_of_slides: presentation.numberOfSlides,
  current_slide: presentation.currentSlide,
  file_name: presentation.fileName,
});
