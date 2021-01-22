import { AnimateSharedLayout } from "framer-motion";
import * as React from "react";

type DraggingItem = {
  item: React.ReactNode;
  containerId: string;
  steal: () => void;
};

type SharedContextApi = {
  draggingItem?: React.MutableRefObject<DraggingItem>;
};

const SharedDragContext = React.createContext({});

export const useSharedDragContext = () =>
  React.useContext<SharedContextApi>(SharedDragContext);

export const SharedDragContainer: React.FC = ({ children }) => {
  const draggingItem = React.useRef<DraggingItem | undefined>();

  return (
    <SharedDragContext.Provider value={{ draggingItem }}>
      <AnimateSharedLayout>{children}</AnimateSharedLayout>
    </SharedDragContext.Provider>
  );
};
