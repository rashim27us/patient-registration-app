export const validatePatientData = (data) => {
    const errors = {};
    
    if (!data.name || data.name.trim() === '') {
        errors.name = 'Name is required';
    }
    
    if (!data.age || isNaN(data.age) || data.age <= 0) {
        errors.age = 'Age must be a positive number';
    }
    
    if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) {
        errors.email = 'Email is invalid';
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};