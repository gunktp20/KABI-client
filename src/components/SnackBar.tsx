import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

interface IProp {
    id: string;
    severity: "error" | "success" | "warning" | "info";
    showSnackBar: boolean;
    snackBarText: string;
    horizontal?: "center" | "right"
}

export default function SnackBar({
    id,
    severity,
    showSnackBar,
    snackBarText,
    horizontal,
}: IProp) {
    const vertical = "top";

    return (
        <div>
            <Snackbar
                id={id}
                open={showSnackBar}
                autoHideDuration={6000}
                anchorOrigin={{ vertical, horizontal: horizontal ? "right" : "center" }}
            >
                <Alert
                    severity={severity}
                    sx={{
                        width: "100%",
                        fontSize: "12px",
                        alignItems: "center",
                        paddingX: "2rem",
                        border: severity === "error" ? 1 : 0,
                        borderColor: severity === "error" ? "#d7414128" : null,
                    }}
                >
                    {snackBarText}
                </Alert>
            </Snackbar>
        </div>
    );
}