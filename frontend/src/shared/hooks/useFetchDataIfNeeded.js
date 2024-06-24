import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";

const useFetchDataIfNeeded = (data, fetchDataAction) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!data || !data.length) {
      dispatch(fetchDataAction());
    }
  }, [dispatch, data, fetchDataAction]);
};

export { useFetchDataIfNeeded };
