const BASE_URL=import.meta.env.VITE_BASE_API_URL;

//Get
export const get = async (endpoint, userId) => {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}?userId=${userId}`);
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("GET Error:", error);
        throw error;
    }
};

//Post
export const post = async (endpoint, data) => {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("POST Error:", error);
        throw error;
    }
};

//Put
export const put = async (endpoint, data, userId) => {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}?userId=${userId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("PUT Error:", error);
        throw error;
    }
};

//Remove
export const remove = async (endpoint, userId, dataId) => {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}?userId=${userId}&dataId=${dataId}`,
            {
                method: "DELETE",
            });
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("DELETE Error:", error);
        throw error;
    }
};