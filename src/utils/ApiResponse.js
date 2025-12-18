class ApiResponse {
    constructor(statusCode,data,message="Success"){
        this.statusCode=statusCode,
        this.data=data,
        this.message=message,
        this.success=statusCode<400
    }
}

export { ApiResponse }
//status codes:
//informational response(100-199)
//successful responses(200-299)
//redirection messages(300-399
//Client error message(400-499)
//server error responses(500-599)