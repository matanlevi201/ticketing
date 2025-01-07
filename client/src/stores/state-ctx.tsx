import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { CurrentUser, Order, Ticket } from "../types";
import { getTickets } from "../api/tickets";
import { getCurrentUser } from "../api/auth";
import { getOrders } from "../api/orders";

const useStore = () => {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [tickets, setTickets] = useState<Ticket[] | null>(null);
  const [orders, setOrders] = useState<Order[] | null>(null);

  return {
    currentUser,
    tickets,
    orders,
    signin: (value: CurrentUser) => setCurrentUser(value),
    signout: () => setCurrentUser(null),
    updateTickets: (value: Ticket[]) => setTickets(value),
    updateOrders: (value: Order[]) => setOrders(value),
  };
};

type StateContextType = {
  currentUser: CurrentUser | null;
  tickets: Ticket[] | null;
  orders: Order[] | null;
  signin: (value: CurrentUser) => void;
  signout: () => void;
  updateTickets: (value: Ticket[]) => void;
  updateOrders: (value: Order[]) => void;
};

const initialState: StateContextType = {
  currentUser: null,
  tickets: null,
  orders: null,
  signin: () => {
    throw new Error("signin function must be implemented");
  },
  signout: () => {
    throw new Error("signout function must be implemented");
  },
  updateTickets: () => {
    throw new Error("signout function must be implemented");
  },
  updateOrders: () => {
    throw new Error("signout function must be implemented");
  },
};

const StateContext = createContext<StateContextType>(initialState);

export const StateContextProvider = ({ children }: { children: ReactNode }) => {
  const store = useStore();

  const initialState = async () => {
    const currentUser = await getCurrentUser();
    const tickets = await getTickets();
    const orders = await getOrders();
    if (currentUser) store.signin(currentUser);
    if (tickets) store.updateTickets(tickets);
    if (orders) store.updateOrders(orders);
  };

  useEffect(() => {
    initialState();
  }, []);

  return (
    <StateContext.Provider value={store}>{children}</StateContext.Provider>
  );
};

export const useSignin = () => {
  const { signin } = useContext(StateContext);
  if (!signin) {
    throw new Error("useLogin must be used within a StateContextProvider");
  }
  return signin;
};

export const useSignout = () => {
  const { signout } = useContext(StateContext);
  if (!signout) {
    throw new Error("useLogout must be used within a StateContextProvider");
  }
  return signout;
};

export const useCurrentUser = () => {
  const { currentUser } = useContext(StateContext);
  if (currentUser === undefined) {
    throw new Error(
      "useCurrentUser must be used within a StateContextProvider"
    );
  }
  return currentUser;
};

export const useTickets = () => {
  const { tickets } = useContext(StateContext);
  if (tickets === undefined) {
    throw new Error("tickets must be used within a StateContextProvider");
  }
  return (tickets ?? []).map(({ id, title, price }) => ({
    id,
    title,
    price,
  }));
};

export const useUpdateTickets = () => {
  const { updateTickets } = useContext(StateContext);
  if (!updateTickets) {
    throw new Error("updateTickets must be used within a StateContextProvider");
  }
  return updateTickets;
};

export const useOrders = () => {
  const { orders } = useContext(StateContext);
  if (orders === undefined) {
    throw new Error("orders must be used within a StateContextProvider");
  }
  return orders ?? [];
};

export const useUpdateOrders = () => {
  const { updateOrders } = useContext(StateContext);
  if (!updateOrders) {
    throw new Error("updateOrders must be used within a StateContextProvider");
  }
  return updateOrders;
};
