import * as React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { ClickAwayListener, IconButton, Tab, Tabs } from '@mui/material';
import { TabContext, TabPanel } from '@mui/lab';
import TabLabel from './TabLabel';
import AddIcon from '@mui/icons-material/Add';
import { v4 as uuidv4 } from 'uuid';
import { useCallback, useState } from 'react';
import ModelNameTooltip from './ModelNameTooltip';
import { useModelNameTooltip } from '../hooks/models.hooks';

export default function App() {
    const firstTabId = `${uuidv4()}`;
    const [models, setModels] = useState([
        { name: 'Model One', id: firstTabId },
    ]);
    const [activeTab, setActiveTab] = useState<string>(firstTabId);

    const {
        isModelNameTooltipOpen,
        openModelNameTooltip,
        closeModelNameTooltip,
    } = useModelNameTooltip();

    const addNewModel = useCallback(
        (name: string) => {
            const id = `${uuidv4()}`;
            setModels((prev) => [...prev, { id, name }]);
            setActiveTab(id);
            closeModelNameTooltip();
        },
        [closeModelNameTooltip]
    );

    const curryEditModelName = (id: string) => (name: string) => {
        setModels(
            models.map((model) =>
                model.id === id
                    ? {
                          id,
                          name,
                      }
                    : model
            )
        );
    };

    const deleteModel = useCallback((id: string) => {
        const deletedIdx = models.findIndex((model) => model.id === id);
        let nextActiveTab: string;
        if (models[deletedIdx].id !== activeTab) {
            nextActiveTab = activeTab;
        } else if (!!models[deletedIdx + 1]) {
            nextActiveTab = models[deletedIdx + 1].id;
        } else if (!!models[deletedIdx - 1]) {
            nextActiveTab = models[deletedIdx - 1].id;
        } else {
            nextActiveTab = models[0].id;
        }

        setModels((prev) =>
            prev.filter((model, index, models) => model.id !== id)
        );
        setActiveTab(nextActiveTab);
    }, [activeTab, models]);

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1 }}
                    >
                        My App
                    </Typography>
                </Toolbar>
            </AppBar>
            <TabContext value={activeTab}>
                <Box
                    sx={{
                        borderBottom: 1,
                        borderColor: 'divider',
                        display: 'flex',
                    }}
                >
                    <Tabs
                        value={activeTab}
                        onChange={(_, val) => setActiveTab(val)}
                        aria-label="basic tabs example"
                    >
                        {models.map((model) => (
                            <Tab
                                key={model.id}
                                label={
                                    <TabLabel
                                        label={model.name}
                                        onDelete={() => deleteModel(model.id)}
                                        onEdit={curryEditModelName(model.id)}
                                    />
                                }
                                value={model.id}
                            />
                        ))}
                    </Tabs>
                    <ClickAwayListener onClickAway={closeModelNameTooltip}>
                        <span>
                            <ModelNameTooltip
                                closeModelNameTooltip={closeModelNameTooltip}
                                onSubmit={addNewModel}
                                isModelNameTooltipOpen={isModelNameTooltipOpen}
                                isNew={true}
                                initialValue={`Model ${models.length + 1}`}
                            >
                                <IconButton
                                    color="primary"
                                    aria-label="add"
                                    onClick={openModelNameTooltip}
                                >
                                    <AddIcon />
                                </IconButton>
                            </ModelNameTooltip>
                        </span>
                    </ClickAwayListener>
                </Box>
                {models.map((model) => (
                    <TabPanel key={model.id} value={model.id}>
                        {model.name}
                    </TabPanel>
                ))}
            </TabContext>
        </>
    );
}
