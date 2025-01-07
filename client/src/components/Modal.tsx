import { Modal } from "@mantine/core";
import { FC } from "react";

interface LocalModalProps {
  component: FC;
  componentProps: Record<string, any>;
  title: string;
  opened: boolean;
  close: () => void;
}

const LocalModal: FC<LocalModalProps> = ({
  component: Component,
  componentProps,
  title,
  opened = false,
  close,
}) => {
  return (
    <Modal
      opened={opened}
      onClose={close}
      title={title}
      centered
      styles={{
        title: {
          fontSize: "24px",
          fontWeight: "bold",
          marginLeft: "auto",
        },
      }}
    >
      <Component {...componentProps} />
    </Modal>
  );
};

export default LocalModal;
