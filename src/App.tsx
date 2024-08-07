import React, { useEffect, useState } from "react";
import {
  Backdrop,
  Box,
  CircularProgress,
  Container,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Card,
  CardContent,
  CardHeader,
} from "@mui/material";
import { Data, useApiQuery } from "./api";
import SwapVertIcon from "@mui/icons-material/SwapVert";

export default function App() {
  const { loading, data } = useApiQuery<Data>({
    action: "https://data.kurzy.cz/json/meny/b[6].json",
    method: "GET",
  });

  const [input, setInput] = useState<Data>();
  const [result, setResult] = useState<number>(0);

  const handleChange = () => {
    if (input?.suma && input?.mena && input?.cilovaMena && data?.kurzy) {
      if (data.kurzy[input.mena] && data.kurzy[input.cilovaMena]) {
        const unitFrom = data.kurzy[input.mena].jednotka;
        const rateFrom = data.kurzy[input.mena].dev_stred;
        const unitTo = data.kurzy[input.cilovaMena].jednotka;
        const rateTo = data.kurzy[input.cilovaMena].dev_stred;

        const convertedAmount = ((Number(input.suma) * rateFrom) / unitFrom) * (unitTo / rateTo);
        setResult(convertedAmount);
      } else {
        setResult(0);
      }
    }
  };

  useEffect(() => {
    handleChange();
  }, [input]);

  useEffect(() => {
    setInput({
      mena: data?.kurzy ? Object.keys(data.kurzy)[0] : "",
      cilovaMena: data?.kurzy ? Object.keys(data.kurzy)[1] : "",
      suma: 1,
    });
  }, [data]);

  return (
    <Paper
      sx={{
        minHeight: { lg: "98vh", xs: "100%" },
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(to right, #1976D2 0%, #1565C0 100%)",
      }}
    >
      <Container sx={{ py: 4 }}>
        <Box>
          {loading ? (
            <Backdrop
              sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={true}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
          ) : (
            <Grid container spacing={4}>
              <Grid item xs={12} md={12} lg={6}>
                <Card elevation={3} sx={{ minHeight: "450px" }}>
                  <CardHeader title="Menová kalkulačka" />
                  <CardContent>
                    <Box component={"form"}>
                      <TextField
                        label="Zadajte sumu"
                        size="small"
                        variant="outlined"
                        required
                        value={input?.suma || "1"}
                        fullWidth
                        onChange={(e) => setInput({ ...input, suma: e.target.value })}
                        sx={{ mb: 3 }}
                      />

                      <FormControl fullWidth sx={{ mb: 1.2 }}>
                        <InputLabel id="mena-z" size="small">
                          Mena z
                        </InputLabel>
                        <Select
                          label="Mena z"
                          required
                          value={input?.mena || ""}
                          size="small"
                          onChange={(e) => setInput({ ...input, mena: e.target.value })}
                        >
                          {Object.entries(data?.kurzy).map((item: Data, key) => (
                            <MenuItem key={key} value={item[0]}>
                              {item[1].nazev}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        sx={{ mb: 1.5 }}
                      >
                        <IconButton
                          onClick={() => {
                            setInput({
                              mena: input?.cilovaMena,
                              cilovaMena: input?.mena,
                              suma: input?.suma,
                            });
                            handleChange();
                          }}
                          color="primary"
                        >
                          <SwapVertIcon />
                        </IconButton>
                      </Box>

                      <FormControl fullWidth sx={{ mb: 3 }}>
                        <InputLabel id="mena-do" size="small">
                          Mena do
                        </InputLabel>
                        <Select
                          label="Mena do"
                          required
                          value={input?.cilovaMena || ""}
                          size="small"
                          onChange={(e) => setInput({ ...input, cilovaMena: e.target.value })}
                        >
                          {Object.entries(data?.kurzy).map((item: Data, key) => (
                            <MenuItem key={key} value={item[0]}>
                              {item[1].nazev}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>

                    <Typography variant="h5" sx={{ mt: 3 }}>
                      Výsledok: {result.toFixed(2)} {data?.kurzy[input?.cilovaMena || ""]?.nazev}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={12} lg={6}>
                <Card elevation={3} sx={{ minHeight: "450px" }}>
                  <CardHeader title="Kurzy Česká národní banka" />
                  <CardContent sx={{ overflowY: "auto", maxHeight: "350px" }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Mena</TableCell>
                          <TableCell>Jednotka</TableCell>
                          <TableCell>Kurz</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {Object.entries(data?.kurzy).map((item: Data, key) => (
                          <TableRow key={key}>
                            <TableCell>{item[0]}</TableCell>
                            <TableCell>{item[1].jednotka}</TableCell>
                            <TableCell>{item[1].dev_stred}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </Box>
      </Container>
    </Paper>
  );
}
