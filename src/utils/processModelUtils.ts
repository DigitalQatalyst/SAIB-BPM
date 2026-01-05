// Utility functions for process model and document integration

export interface ProcessModel {
    id: string;
    title: string;
    nodes: any[];
    edges: any[];
    imageDataUrl: string;
    createdAt: string;
    createdBy: string;
}

/**
 * Save a process model with its image to localStorage
 */
export const saveProcessModel = (processModel: ProcessModel): void => {
    const processModelsKey = 'processModels';
    const existingModels = localStorage.getItem(processModelsKey);
    const models = existingModels ? JSON.parse(existingModels) : [];
    models.push(processModel);
    localStorage.setItem(processModelsKey, JSON.stringify(models));
};

/**
 * Link a process model to a document
 */
export const linkProcessModelToDocument = (documentId: string, processModelId: string): void => {
    localStorage.setItem(`document_${documentId}_processModel`, processModelId);
};

/**
 * Get the process model linked to a document
 */
export const getLinkedProcessModel = (documentId: string): ProcessModel | null => {
    const processModelId = localStorage.getItem(`document_${documentId}_processModel`);
    if (!processModelId) return null;

    const processModelsKey = 'processModels';
    const existingModels = localStorage.getItem(processModelsKey);
    if (!existingModels) return null;

    const models: ProcessModel[] = JSON.parse(existingModels);
    return models.find(m => m.id === processModelId) || null;
};

/**
 * Get process model image for embedding in Word documents
 */
export const getProcessModelImage = (documentId: string): string | null => {
    const model = getLinkedProcessModel(documentId);
    return model ? model.imageDataUrl : null;
};
