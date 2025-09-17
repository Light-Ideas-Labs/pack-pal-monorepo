"use client"

import { useRef } from "react"
import { TypedUseSelectorHook, useDispatch, useSelector, Provider, } from "react-redux"
import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import globalReducer from "./globalSlice"
import authReducer from "./authSlice"
import { api } from "./api"


const rootReducer = combineReducers({
  auth: authReducer,
  global: globalReducer,
  [api.reducerPath]: api.reducer,
})

export const makeStore = () => {
  const isDev = process.env.NODE_ENV !== "production"

  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: isDev ? {
          // If you later pipe File/FormData through actions:
          ignoredActions: [
            // all api lifecycle actions
            "/^api\/.*\/pending$/",
            "/^api\/.*\/fulfilled$/",
            "/^api\/.*\/rejected$/",
            // or explicitly:
            "api/executeMutation/pending",
            "api/executeMutation/fulfilled",
            "api/executeMutation/rejected",
          ],
          ignoredActionPaths: [
            "meta.arg.originalArgs.file",
            "meta.arg.originalArgs.formData",
            "payload.file",
            "meta.baseQueryMeta",  
          ],
          ignoredPaths: [
            "meta.baseQueryMeta",
            "payload.baseQueryMeta",
            "api.queries",
            "api.mutations",
          ],
        }
        : false,
      }).concat(api.middleware),
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore["getState"]>
export type AppDispatch = AppStore["dispatch"]

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export default function StoreProvider({children,}: {children: React.ReactNode}) {
  const storeRef = useRef<AppStore | null>(null)
  if (!storeRef.current) {
    storeRef.current = makeStore()
    setupListeners(storeRef.current.dispatch)
  }

  return <Provider store={storeRef.current}>{children}</Provider>
}
