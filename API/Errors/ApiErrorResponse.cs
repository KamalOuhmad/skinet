using System;

namespace API.Errors;

public class ApiErrorResponse (int statusCode, string message, string? details)
{
    public string? Details { get; set; } = details;
    public string Message { get; set; } = message;
    public int StatusCode { get; set; } = statusCode;

}
