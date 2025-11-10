// ✅ Handles form creation, responses, and localStorage management
const FORMS_KEY = "forms";
const RESPONSES_KEY = "form_responses";

export function getForms() {
  const raw = localStorage.getItem(FORMS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function getFormById(id) {
  return getForms().find((f) => f.id === id);
}

export function saveForm(form) {
  const forms = getForms();
  const index = forms.findIndex((f) => f.id === form.id);
  if (index >= 0) forms[index] = form;
  else forms.push(form);
  localStorage.setItem(FORMS_KEY, JSON.stringify(forms));
}

export function createEmptyForm(name) {
  return {
    id: `form_${Date.now()}`,
    formName: name || "Untitled Form",
    fields: [],
  };
}

export function deleteForm(id) {
  const forms = getForms().filter((f) => f.id !== id);
  localStorage.setItem(FORMS_KEY, JSON.stringify(forms));
}

// ✅ Save user submission
export function saveResponse(formId, answers) {
  const raw = localStorage.getItem(RESPONSES_KEY);
  const responses = raw ? JSON.parse(raw) : [];
  const newResponse = {
    formId,
    responseId: `resp_${Date.now()}`,
    date: new Date().toISOString(),
    answers,
  };
  responses.push(newResponse);
  localStorage.setItem(RESPONSES_KEY, JSON.stringify(responses));
  return newResponse;
}

// ✅ Get all responses for a specific form
export function getResponses(formId) {
  const raw = localStorage.getItem(RESPONSES_KEY);
  const responses = raw ? JSON.parse(raw) : [];
  return responses.filter((r) => r.formId === formId);
}
