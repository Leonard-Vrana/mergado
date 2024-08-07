import axios from "axios";
import React, { useEffect } from "react";

export type ApiQueryType = {
  action: string;
  params?: any;
  onLoadScreen?: boolean;
  authorization?: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
};

export type ApiQuery<TData> = {
  data?: TData | null;
  error?: any;
  loading?: boolean;
  execute: (params: TData[]) => void;
};

export type Data = {
  [x: string]: any;
};

export const useApiQuery = <TData extends any>(props: ApiQueryType): ApiQuery<TData> => {
  const { action, params, method, authorization, onLoadScreen = true } = props;
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<TData | null>(null);
  const [error, setError] = React.useState<any>(null);

  const fetchData = async (params: TData[]) => {
    setLoading(true);
    try {
      const response = await axios({
        method: method ?? "POST",
        url: action,
        headers: {
          "Content-Type": "text/plain",
          ...(authorization && { Authorization: authorization }),
        },
        data: {
          ...(params && { params }),
        },
      });
      setData(response.data as TData);
    } catch (e) {
      setError(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (onLoadScreen) {
      fetchData(params);
    }
  }, [onLoadScreen]);

  const execute = (params: TData[]) => {
    fetchData(params);
  };

  return { loading, data, error, execute };
};
