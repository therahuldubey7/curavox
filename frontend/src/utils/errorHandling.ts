export class APIError extends Error {
  constructor(message: string, public status?: number, public code?: string) {
    super(message);
    this.name = "APIError";
  }
}

export const handleAPIError = (error: any): APIError => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    return new APIError(
      error.response.data.message || "Server error",
      error.response.status,
      error.response.data.code
    );
  } else if (error.request) {
    // The request was made but no response was received
    return new APIError("No response from server");
  } else {
    // Something happened in setting up the request that triggered an Error
    return new APIError("Request configuration error");
  }
};
