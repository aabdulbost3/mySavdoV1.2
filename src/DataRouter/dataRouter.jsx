import { Routes, Route } from "react-router-dom";
import { DataRouterjson } from "./dataRouter.js";
import { Suspense } from "react";
import CircularLoading from "../Pages/Loading";

function DataRouter() {
  return (
    <>
      <Routes>
        {DataRouterjson.map((elem) => (
          <Route
            key={elem.id}
            path={elem.path}
            element={<Suspense fallback={<CircularLoading />}>{elem.Element}</Suspense>}
          />
        ))}
      </Routes>
    </>
  );
}
export default DataRouter;