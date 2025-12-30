import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faPencil,
  faEraser,
  faPalette,
  faTrash,
  faMinus,
  faRotateLeft,
  type IconDefinition,
} from "@fortawesome/free-solid-svg-icons";

interface ToolbarProp {
  handleClear: () => void;
  handleUndo: () => void;
  setActiveColor: (color: string) => void;
}

const Toolbar = ({ handleClear, handleUndo, setActiveColor }: ToolbarProp) => {
  const handlePencil = () => {
    setActiveColor("#000");
  };

  const handleEraser = () => {
    setActiveColor("#fff");
  };

  return (
    <div className="fixed left-4 top-20 z-50 flex flex-col gap-2 rounded-xl backdrop-blur p-2 shadow-lg border-gray-600">
      <ToolButton click={handlePencil} icon={faPencil} label="Pencil" />
      <ToolButton click={handleEraser} icon={faEraser} label="Eraser" />
      <ToolButton icon={faPalette} label="Color" />
      <ToolButton icon={faMinus} label="Stroke width" />
      <ToolButton click={handleClear} icon={faTrash} label="Clear canvas" />
      <ToolButton click={handleUndo} icon={faRotateLeft} label="Undo" />
    </div>
  );
};

interface ToolButtonProp {
  icon: IconDefinition;
  label: string;
  click?: () => void;
}

const ToolButton = ({ icon, label, click }: ToolButtonProp) => {
  return (
    <button
      onClick={click}
      title={label}
      className="h-12 w-12 flex items-center justify-center rounded-lg text-shadow-blue-950 hover:bg-gray-100 active:bg-gray-200 transition cursor-pointer"
    >
      <FontAwesomeIcon icon={icon} />
    </button>
  );
};

export default Toolbar;
