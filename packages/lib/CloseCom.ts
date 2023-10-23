import logger from "@calcom/lib/logger";

export type CloseComLead = {
  companyName?: string | null | undefined;
  contactName?: string;
  contactEmail?: string;
  description?: string;
  id?: string | PromiseLike<string>;
};

export type CloseComFieldOptions = [string, string, boolean, boolean][];

export type CloseComLeadCreateResult = {
  status_id: string;
  status_label: string;
  display_name: string;
  addresses: { [key: string]: string }[];
  name: string;
  contacts: { [key: string]: string }[];
  [key: CloseComCustomActivityCustomField<string>]: string;
  id: string;
};

export type CloseComStatus = {
  id: string;
  organization_id: string;
  label: string;
};

export type CloseComCustomActivityTypeCreate = {
  name: string;
  description: string;
};

export type CloseComContactSearch = {
  data: {
    __object_type: "contact";
    emails: {
      email: string;
      type: string;
    }[];
    id: string;
    lead_id: string;
    name: string;
  }[];
  cursor: null;
};

export type CloseComCustomActivityTypeGet = {
  data: {
    api_create_only: boolean;
    created_by: string;
    date_created: string;
    date_updated: string;
    description: string;
    editable_with_roles: string[];
    fields: CloseComCustomActivityFieldGet["data"][number][];
    id: string;
    name: string;
    organization_id: string;
    updated_by: string;
  }[];
  cursor: null;
};

export type CloseComCustomActivityFieldCreate = CloseComCustomContactFieldCreate & {
  custom_activity_type_id: string;
};

export type CloseComCustomContactFieldGet = {
  data: {
    id: string;
    name: string;
    description: string;
    type: string;
    choices?: string[];
    accepts_multiple_values: boolean;
    editable_with_roles: string[];
    date_created: string;
    date_updated: string;
    created_by: string;
    updated_by: string;
    organization_id: string;
  }[];
};

export type CloseComCustomContactFieldCreate = {
  name: string;
  description?: string;
  type: string;
  required: boolean;
  accepts_multiple_values: boolean;
  editable_with_roles: string[];
  choices?: string[];
};

export type CloseComCustomActivityFieldGet = {
  data: {
    id: string;
    name: string;
    description: string;
    type: string;
    choices?: string[];
    accepts_multiple_values: boolean;
    editable_with_roles: string[];
    date_created: string;
    date_updated: string;
    created_by: string;
    updated_by: string;
    organization_id: string;
    custom_activity_type_id: string;
  }[];
};

export type CloseComCustomActivityCreate = {
  custom_activity_type_id: string;
  lead_id: string;
  [key: CloseComCustomActivityCustomField<string>]: string;
};

export type typeCloseComCustomActivityGet = {
  organization_id: string;
  contact_id: string;
  date_updated: string;
  user_name: string;
  created_by_name: "Bruce Wayne";
  id: string;
  created_by: string;
  status: string;
  user_id: string;
  users: string[];
  lead_id: string;
  _type: string;
  updated_by: string;
  custom_activity_type_id: string;
  date_created: string;
  updated_by_name: string;
  [key: CloseComCustomActivityCustomField<string>]: string;
};

type CloseComCustomActivityCustomField<T extends string> = `custom.${T}`;

const environmentApiKey = process.env.CLOSECOM_API_KEY || "";

type CloseComQuery = {
  negate?: boolean;
  queries?: CloseComQuery[] | CloseComCondition[];
  object_type?: string;
  related_object_type?: string;
  related_query?: CloseComQuery;
  this_object_type?: string;
  type?: "object_type" | "has_related" | "and" | "or";
  _fields?: string[];
};

type CloseComCondition = {
  condition: {
    mode: "full_words";
    type: "text";
    value: string;
  };
  field: {
    field_name: string;
    object_type: string;
    type: "regular_field";
  };
  negate: boolean;
  type: "field_condition";
};

export type CloseComCustomFieldCreateResponse = {
  data: {
    id: string;
    name?: string;
    type?: string;
    required?: boolean;
    accepts_multiple_values: boolean;
    editable_with_roles: string[];
    custom_activity_type_id?: string;
  };
};

/**
 * This class to instance communicating to Close.com APIs requires an API Key.
 *
 * You can either pass to the constructor an API Key or have one defined as an
 * environment variable in case the communication to Close.com is just for
 * one account only, not configurable by any user at any moment.
 */
export default class CloseCom {
  private apiUrl = "https://api.close.com/api/v1";
  private apiKey: string | undefined = undefined;
  private log: typeof logger;

  constructor(providedApiKey = "") {
    this.log = logger.getChildLogger({ prefix: [`[[lib] close.com`] });
    if (!providedApiKey && !environmentApiKey) throw Error("Close.com Api Key not present");
    this.apiKey = providedApiKey || environmentApiKey;
  }

  public me = () => this._get({ urlPath: "/me/" });

  public contact = {
    search: ({ emails }: { emails: string[] }) => this._post({
        urlPath: "/data/search/",
        data: closeComQueries.contact.search(emails),
      }),
    create: (data: {
      person: { name: string | null; email: string };
      leadId: string;
    }) => this._post({ urlPath: "/contact/", data: closeComQueries.contact.create(data) }),
    update: ({
      contactId,
      ...data
    }: {
      person: { name: string; email: string };
      contactId: string;
      leadId?: string;
    }) => this._put({
        urlPath: `/contact/${contactId}/`,
        data: closeComQueries.contact.update(data),
      }),
    delete: (contactId: string) => this._delete({
        urlPath: `/contact/${contactId}/`,
      }),
  };

  public lead = {
    list: ({
      query,
    }: {
      query: CloseComQuery;
    }) => this._get({ urlPath: "/lead", query }),
    status: () => this._get({ urlPath: `/status/lead/` }),
    update: (leadId: string, data: CloseComLead) => this._put({
        urlPath: `/lead/${leadId}`,
        data,
      }),
    create: (data: CloseComLead) => this._post({
        urlPath: "/lead/",
        data: closeComQueries.lead.create(data),
      }),
    delete: (leadId: string) => this._delete({ urlPath: `/lead/${leadId}/` }),
  };

  public customActivity = {
    type: {
      create: (data: CloseComCustomActivityTypeCreate) => this._post({
          urlPath: "/custom_activity",
          data: closeComQueries.customActivity.type.create(data),
        }),
      get: () => this._get({ urlPath: "/custom_activity" }),
    },
  };

  public customField = {
    activity: {
      create: (data: CloseComCustomActivityFieldCreate) => this._post({ urlPath: "/custom_field/activity/", data }),
      get: ({ query }: { query: CloseComQuery }) => this._get({ urlPath: "/custom_field/activity/", query }),
    },
    contact: {
      create: (data: CloseComCustomContactFieldCreate) => this._post({ urlPath: "/custom_field/contact/", data }),
      get: ({ query }: { query: CloseComQuery }) => this._get({ urlPath: "/custom_field/contact/", query }),
    },
    shared: {
      get: ({ query }: { query: CloseComQuery }) => this._get({ urlPath: "/custom_field/shared/", query }),
    },
  };

  public activity = {
    custom: {
      create: (data: CloseComCustomActivityCreate) => this._post({ urlPath: "/activity/custom/", data }),
      delete: (uuid: string) => this._delete({ urlPath: `/activity/custom/${uuid}/` }),
      update: (uuid: string,
        data: Partial<CloseComCustomActivityCreate>) => this._put({ urlPath: `/activity/custom/${uuid}/`, data }),
    },
  };

  private _get = ({ urlPath, query }: { urlPath: string; query?: CloseComQuery }) => await this._request({ urlPath, method: "get", query });
  private _post = ({ urlPath, data }: { urlPath: string; data: Record<string, unknown> }) => this._request({ urlPath, method: "post", data });
  private _put = ({ urlPath, data }: { urlPath: string; data: Record<string, unknown> }) => this._request({ urlPath, method: "put", data });
  private _delete = ({ urlPath }: { urlPath: string }) => this._request({ urlPath, method: "delete" });
  private _request = async ({
    urlPath,
    data,
    method,
    query,
  }: {
    urlPath: string;
    method: string;
    query?: CloseComQuery;
    data?: Record<string, unknown>;
  }) => {
    this.log.debug(method, urlPath, query, data);
    const credentials = Buffer.from(`${this.apiKey}:`).toString("base64");
    const headers = {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/json",
    };
    const queryString = query ? `?${new URLSearchParams(String(query)).toString()}` : "";
    return await fetch(`${this.apiUrl}${urlPath}${queryString}`, {
      headers,
      method,
      body: JSON.stringify(data),
    }).then(async (response) => {
      if (!response.ok) {
        const message = `[Close.com app] An error has occured: ${response.status}`;
        this.log.error(await response.json());
        throw new Error(message);
      }
      return await response.json();
    });
  };
}

export const closeComQueries = {
  contact: {
    search(contactEmails: string[]) {
      return {
        limit: null,
        _fields: {
          contact: ["id", "name", "emails"],
        },
        query: {
          negate: false,
          queries: [
            {
              negate: false,
              object_type: "contact",
              type: "object_type",
            },
            {
              negate: false,
              queries: [
                {
                  negate: false,
                  related_object_type: "contact_email",
                  related_query: {
                    negate: false,
                    queries: contactEmails.map((contactEmail) => ({
                      condition: {
                        mode: "full_words",
                        type: "text",
                        value: contactEmail,
                      },
                      field: {
                        field_name: "email",
                        object_type: "contact_email",
                        type: "regular_field",
                      },
                      negate: false,
                      type: "field_condition",
                    })),
                    type: "or",
                  },
                  this_object_type: "contact",
                  type: "has_related",
                },
              ],
              type: "and",
            },
          ],
          type: "and",
        },
        results_limit: null,
        sort: [],
      };
    },
    create(data: { person: { name: string | null; email: string }; leadId: string }) {
      return {
        lead_id: data.leadId,
        name: data.person.name ?? data.person.email,
        emails: [{ email: data.person.email, type: "office" }],
      };
    },
    update({ person, leadId, ...rest }: { person: { name: string; email: string }; leadId?: string }) {
      return {
        ...(leadId && { lead_id: leadId }),
        name: person.name ?? person.email,
        emails: [{ email: person.email, type: "office" }],
        ...rest,
      };
    },
  },
  lead: {
    create({ companyName, contactEmail, contactName, description }: CloseComLead) {
      return {
        name: companyName,
        ...(description ? { description } : {}),
        ...(contactEmail && contactName
          ? {
              contacts: [
                {
                  name: contactName,
                  email: contactEmail,
                  emails: [
                    {
                      type: "office",
                      email: contactEmail,
                    },
                  ],
                },
              ],
            }
          : {}),
      };
    },
  },
  customActivity: {
    type: {
      create({ name, description }: CloseComCustomActivityTypeCreate) {
        return {
          name: name,
          description: description,
          api_create_only: false,
          editable_with_roles: ["admin"],
        };
      },
    },
  },
  customField: {
    activity: {
      create({
        custom_activity_type_id,
        name,
        type,
        required,
        accepts_multiple_values,
      }: CloseComCustomActivityFieldCreate) {
        return {
          custom_activity_type_id,
          name,
          type,
          required,
          accepts_multiple_values,
          editable_with_roles: [],
        };
      },
    },
  },
};
