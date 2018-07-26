import { CoreResponseType } from 'coreRouter';

interface CoreSuccessHandler {
  /**
   *  OK - status 200
   *  The request has succeeded. The information returned with the response is dependent on the method used in the request, for example:
      GET an entity corresponding to the requested resource is sent in the response;
      HEAD the entity-header fields corresponding to the requested resource are sent in the response without any message-body;
      POST an entity describing or containing the result of the action;
      TRACE an entity containing the request message as received by the end server.
   */
  OK(data: any): void;
  /**
   * Created - status 201
   * The request has been fulfilled and resulted in a new resource being created.
   * The newly created resource can be referenced by the URI(s) returned in the entity of the response,
   * with the most specific URI for the resource given by a Location header field. The response SHOULD include an entity containing a list of resource characteristics and location(s) from which the user or user agent can choose the one most appropriate. The entity format is specified by the media type given in the Content-Type header field. The origin server MUST create the resource before returning the 201 status code.
   * If the action cannot be carried out immediately, the server SHOULD respond with 202 (Accepted) response instead.
   * A 201 response MAY contain an ETag response header field indicating the current value of the entity tag for the requested variant just created, see section 14.19.
   */
  Created(data: any): void;
}
interface CoreErrorHandler {
  /**
   * Bad Request - status 400
   * The request could not be understood by the server due to malformed syntax. The client SHOULD NOT repeat the request without modifications.
   */
  BadRequest(): void;

  /**
   * Unauthorized - status 401
   * The request requires user authentication.
   * The response MUST include a WWW-Authenticate header field (section 14.47) containing a challenge applicable to the requested resource.
   * The client MAY repeat the request with a suitable Authorization header field (section 14.8).
   * If the request already included Authorization credentials,
   * then the 401 response indicates that authorization has been refused for those credentials.
   * If the 401 response contains the same challenge as the prior response,
   * and the user agent has already attempted authentication at least once,
   * then the user SHOULD be presented the entity that was given in the response,
   * since that entity might include relevant diagnostic information.
   * HTTP access authentication is explained in "HTTP Authentication: Basic and Digest Access Authentication" [43].
   */
  Unauthorized(): void;

  /**
   * Payment Required - status 402
   * This code is reserved for future use.
   */
  PaymentRequired(): void;

  /**
   * Forbidden - status 403
   * The server understood the request, but is refusing to fulfill it. Authorization will not help and the request SHOULD NOT be repeated. If the request method was not HEAD and the server wishes to make public why the request has not been fulfilled, it SHOULD describe the reason for the refusal in the entity. If the server does not wish to make this information available to the client, the status code 404 (Not Found) can be used instead.
   */
  Forbidden(): void;

  /**
   * Not Found - status 404
   * The server has not found anything matching the Request-URI.
   * No indication is given of whether the condition is temporary or permanent.
   * The 410 (Gone) status code SHOULD be used if the server knows,
   * through some internally configurable mechanism,
   * that an old resource is permanently unavailable and has no forwarding address.
   * This status code is commonly used when the server does not wish to reveal exactly why the request has been refused,
   * or when no other response is applicable.
   */
  NotFound(): void;

  /**
   * Method Not Allowed - status 405
   * The method specified in the Request-Line is not allowed for the resource identified by the Request-URI.
   * The response MUST include an Allow header containing a list of valid methods for the requested resource.
   */
  MethodNotAllowed(): void;

  /**
   * Internal Server Error - status 500
   * The server encountered an unexpected condition which prevented it from fulfilling the request.
   */
  InternalServerError(): void;

  /**
   * Bad Gateway - status 502
   */
  BadGateway(): void;
}

export interface ResponseStatusHandler
  extends CoreSuccessHandler,
    CoreErrorHandler {
  // 2xx
  OK(data: any): void;
  Created(data: any): void;
  // 4xx
  BadRequest(): void;
  Unauthorized(): void;
  PaymentRequired(): void;
  Forbidden(): void;
  NotFound(): void;
  MethodNotAllowed(): void;
  // 5xx
  InternalServerError(): void;
  BadGateway(): void;
}

declare namespace Express {
  interface Response {
    responseStatusHandler: ResponseStatusHandler;
  }
}
