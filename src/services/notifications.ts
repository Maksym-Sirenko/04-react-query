import toast from "react-hot-toast";

interface NotifyOptions {
  message: string;
  icon: string;
}

const notify = ({ message, icon }: NotifyOptions) => {
  toast(message, {
    icon,
    style: { borderRadius: "12px", background: "#222", color: "#fff" },
  });
};

export const notifyFill = () =>
  notify({ message: "Please enter your search query.", icon: "❕" });

export const notifyEmpty = () =>
  notify({ message: "No movies found for your request.", icon: "❔" });
