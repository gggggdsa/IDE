import React, { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { ThemeProvider, CssBaseline } from "@mui/material";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import {
  Tree,
  MultiBackend,
  getDescendants,
  getBackendOptions,
} from "@minoru/react-dnd-treeview";
import { CustomNode } from "./customNode/CustomNode";
import { CustomDragPreview } from "./customDragPreview/CustomDragPreview";
import { AddDialog } from "./addDialog/AddDialog";
import { theme } from "./theme";
import styles from "./Sidebar.css";
import { useDispatch, useSelector } from "react-redux";
import {
  addFile,
  addFolder,
  deleteFileOrFolder,
  selectFile,
  setCurrentEditingFile,
  setTreeData,
} from "../../fileSlice/FileSlice";
import { deleteFolderAPI } from "../../../../api/ideAPI/deleteFolderAPI";
import { useMutation } from "react-query";

function Sidebar() {
  const filesAndFolders = useSelector((state) => state.file.data);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [, forceUpdate] = useState();

  useEffect(() => {
    forceUpdate({});
  }, [filesAndFolders]);
  const handleFileClick = (node) => {
    // 클릭한 파일의 ID와 내용
    const clickedFileId = node.id;
    const clickedFileContent = node.content || ""; // 예: 초기 파일 내용 설정

    // 편집 중인 파일 정보를 업데이트
    dispatch(
      setCurrentEditingFile({ id: clickedFileId, content: clickedFileContent }),
    );

    // 선택된 파일의 ID를 설정 (새로 추가된 부분)
    dispatch(selectFile(clickedFileId));
  };

  const handleDrop = (newTree) => {
    dispatch(setTreeData(newTree));
  };

  const deleteFolderMutation = useMutation(deleteFolderAPI, {
    onSuccess: (data, folderId) => {
      dispatch(deleteFileOrFolder(folderId));
    },

    // 에러가 발생한 경우의 처리
    onError: (error) => {
      console.error("폴더 삭제 실패", error.message);
    },
  });

  const handleDelete = (folderId) => {
    deleteFolderMutation.mutate(folderId);
  };

  const handleCopy = (id) => {
    // Handle node copy logic
    // TODO
  };

  const handleOpenDialog = () => {
    // Handle open dialog logic
    // TODO
  };

  const handleCloseDialog = () => {
    // Handle close dialog logic
    // TODO
  };

  const handleSubmit = (newNode) => {
    // newNode의 type에 따라 addFile 또는 addFolder 액션을 dispatch
    if (newNode.type === "file") {
      dispatch(addFile(newNode));
    } else {
      dispatch(addFolder(newNode));
    }
  };

  console.log("filesAndFolders", filesAndFolders);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DndProvider backend={MultiBackend} options={getBackendOptions()}>
        <div className={styles.app}>
          <div>
            {open && (
              <AddDialog
                tree={filesAndFolders}
                onClose={handleCloseDialog}
                onSubmit={handleSubmit}
              />
            )}
          </div>
          <Tree
            tree={filesAndFolders}
            rootId={0}
            render={(node, options) => (
              <CustomNode
                node={node}
                {...options}
                onDelete={handleDelete}
                onCopy={handleCopy}
                onClick={() => handleFileClick(node)}
              />
            )}
            dragPreviewRender={(monitorProps) => (
              <CustomDragPreview monitorProps={monitorProps} />
            )}
            onDrop={handleDrop}
            classes={{
              root: styles.treeRoot,
              draggingSource: styles.draggingSource,
              dropTarget: styles.dropTarget,
            }}
          />
        </div>
      </DndProvider>
    </ThemeProvider>
  );
}

export default Sidebar;
