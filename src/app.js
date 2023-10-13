import { intakeSection } from './intake-section.js';

const section = intakeSection(data => {
    console.log(data);
    section.fadeOut();
});