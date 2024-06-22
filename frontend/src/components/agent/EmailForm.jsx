import { useState } from 'react';
import { useEmailsContext } from "../../hooks/useEmailsContext";
import { useAuthContext } from "../../hooks/useAuthContext";
import { Box, Button, TextField, CircularProgress, Modal, Grid } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const EmailForm = () => {
    const { dispatch } = useEmailsContext();
    const { userLG } = useAuthContext();

    const [emailData, setEmailData] = useState({
        from: '',
        to: '',
        subject: '',
        text: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [emptyFields, setEmptyFields] = useState([]);
    const [openSuccessModal, setOpenSuccessModal] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmailData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!userLG) {
            setError('You must be logged in');
            setLoading(false);
            return;
        }

        const response = await fetch('/api/emails/', {
            method: 'POST',
            body: JSON.stringify(emailData),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userLG.token}`
            }
        });

        const json = await response.json();
        setLoading(false);

        if (!response.ok) {
            setError(json.error);
            setEmptyFields(json.emptyFields || []);
        } else {
            setError(null);
            setEmailData({
                from: '',
                to: '',
                subject: '',
                text: ''
            });
            setEmptyFields([]);
            setOpenSuccessModal(true);
            dispatch({ type: 'CREATE_EMAIL', payload: json });
        }
    };

    const handleCloseSuccessModal = () => {
        setOpenSuccessModal(false);
    };

    return (
        <Box
            sx={{
                position: 'absolute',
                top: '50%',
                left: '55%',
                transform: 'translate(-50%, -50%)',
                width: 900,
                bgcolor: 'background.paper',
                border: '2px solid #000',
                boxShadow: 24,
                p: 5,
            }}
        >
            <form onSubmit={handleSubmit}>
                <div className="title">Add New Email</div>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="From"
                            name="from"
                            value={emailData.from}
                            onChange={handleChange}
                            margin="normal"
                            error={emptyFields.includes('from')}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="To"
                            name="to"
                            value={emailData.to}
                            onChange={handleChange}
                            margin="normal"
                            error={emptyFields.includes('to')}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Subject"
                            name="subject"
                            value={emailData.subject}
                            onChange={handleChange}
                            margin="normal"
                            error={emptyFields.includes('subject')}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            multiline
                            rows={5}
                            label="Text"
                            name="text"
                            value={emailData.text}
                            onChange={handleChange}
                            margin="normal"
                            error={emptyFields.includes('text')}
                            InputProps={{
                                sx: {
                                    padding: 15, // Increase padding
                                }
                            }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Box mt={2}>
                            <Button variant="contained" type="submit" fullWidth>
                                {loading ? <CircularProgress size={24} /> : "Submit"}
                            </Button>
                        </Box>
                    </Grid>
                    {error && <Grid item xs={12}><div className="error">{error}</div></Grid>}
                </Grid>
            </form>
            <Modal
                open={openSuccessModal}
                onClose={handleCloseSuccessModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4,
                        textAlign: 'center',
                    }}
                >
                    <CheckCircleIcon sx={{ color: '#94e2cd', fontSize: 60 }} />
                    <div className="success">New email added!</div>
                </Box>
            </Modal>
        </Box>
    );
};

export default EmailForm;