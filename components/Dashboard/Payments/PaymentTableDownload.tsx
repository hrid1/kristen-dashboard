"use client";

import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

interface PaymentUser {
    email: string;
    name: string;
}

interface PaymentRecord {
    planName: string;
    status: string;
    updated_at: string;
    cardLast4: string;
    user: PaymentUser;
}

type PaymentList = PaymentRecord[];

// Create styles for table layout
const styles = StyleSheet.create({
    page: {
        padding: 30,
        backgroundColor: "#FFFFFF",
        fontFamily: "Helvetica",
    },

    // Header section
    header: {
        marginBottom: 20,
        borderBottomWidth: 2,
        borderBottomColor: "#C6A664",
        paddingBottom: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#1E293B",
        textAlign: "center",
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 10,
        color: "#64748B",
        textAlign: "center",
    },
    dateRange: {
        fontSize: 9,
        color: "#94A3B8",
        textAlign: "right",
        marginTop: 5,
    },

    // Table styles
    table: {
        display: "flex",
        width: "100%",
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#E2E8F0",
        borderRadius: 4,
        marginTop: 10,
    },

    // Table header row
    tableHeader: {
        flexDirection: "row",
        backgroundColor: "#C6A664",
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
    },
    headerCell: {
        padding: 10,
        fontWeight: "bold",
        fontSize: 10,
        color: "#FFFFFF",
        borderRightWidth: 1,
        borderRightColor: "#D4A86A",
        textAlign: "left",
    },

    // Table body rows
    tableRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#E2E8F0",
        backgroundColor: "#FFFFFF",
    },
    tableRowEven: {
        backgroundColor: "#F8FAFC",
    },
    tableCell: {
        padding: 8,
        fontSize: 9,
        color: "#334155",
        borderRightWidth: 1,
        borderRightColor: "#E2E8F0",
        textAlign: "left",
    },

    // Status badge styles
    statusBadge: {
        paddingVertical: 3,
        paddingHorizontal: 8,
        borderRadius: 12,
        fontSize: 8,
        fontWeight: "bold",
        textAlign: "center",
        alignSelf: "flex-start",
    },
    statusActive: {
        backgroundColor: "#DCFCE7",
        color: "#166534",
    },
    statusInactive: {
        backgroundColor: "#FEE2E2",
        color: "#991B1B",
    },
    statusPending: {
        backgroundColor: "#FEF9C3",
        color: "#854D0E",
    },
    statusCancelled: {
        backgroundColor: "#F1F5F9",
        color: "#475569",
    },

    // Last cell without right border
    lastCell: {
        borderRightWidth: 0,
    },

    // Footer section
    footer: {
        marginTop: 20,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: "#E2E8F0",
        flexDirection: "row",
        justifyContent: "space-between",
        fontSize: 8,
        color: "#64748B",
    },

    // Column widths
    colName: { width: "17%" },
    colEmail: { width: "22%" },
    colPlan: { width: "13%" },
    colCard: { width: "15%" },
    colStatus: { width: "12%" },
    colDate: { width: "21%" },
});

// Helper function to format date
const formatDate = (dateString: string | null): string => {
    if (!dateString) return "N/A";
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    } catch {
        return "N/A";
    }
};

// Helper function to get status style
const getStatusStyle = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
        case "active":
            return styles.statusActive;
        case "inactive":
            return styles.statusInactive;
        case "pending":
            return styles.statusPending;
        case "cancelled":
        case "canceled":
            return styles.statusCancelled;
        default:
            return styles.statusInactive;
    }
};

// Helper function to format card number
const formatCardNumber = (cardLast4: string): string => {
    if (!cardLast4) return "N/A";
    return `**** **** ${cardLast4}`;
};

export const PaymentTableDownload = ({ apiItem }: { apiItem: PaymentList | undefined }) => {
    // If no data provided, use empty array
    const payments = apiItem || [];

    // Calculate summary statistics
    const totalPayments = payments.length;
    const activePayments = payments.filter(p => p.status.toLowerCase() === "active").length;
    const pendingPayments = payments.filter(p => p.status.toLowerCase() === "pending").length;

    // Get current date for report generation info
    const generationDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header Section */}
                <View style={styles.header}>
                    <Text style={styles.title}>Payment Management Report</Text>
                    <Text style={styles.subtitle}>
                        Complete List of Payment Transactions
                    </Text>
                    <Text style={styles.dateRange}>
                        Generated on: {generationDate}
                    </Text>
                </View>


                {/* Table */}
                <View style={styles.table}>
                    {/* Table Header */}
                    <View style={styles.tableHeader}>
                        <Text style={[styles.headerCell, styles.colName]}>Name</Text>
                        <Text style={[styles.headerCell, styles.colEmail]}>Email</Text>
                        <Text style={[styles.headerCell, styles.colPlan]}>Plan</Text>
                        <Text style={[styles.headerCell, styles.colCard]}>Card</Text>
                        <Text style={[styles.headerCell, styles.colStatus]}>Status</Text>
                        <Text style={[styles.headerCell, styles.colDate, styles.lastCell]}>Updated</Text>
                    </View>

                    {/* Table Body */}
                    {payments.length > 0 ? (
                        payments.map((payment, index) => {
                            const rowStyle = index % 2 === 0 ? styles.tableRow : [styles.tableRow, styles.tableRowEven];

                            return (
                                <View key={index} style={rowStyle}>
                                    <Text style={[styles.tableCell, styles.colName]}>
                                        {payment.user?.name || "N/A"}
                                    </Text>
                                    <Text style={[styles.tableCell, styles.colEmail]}>
                                        {payment.user?.email || "N/A"}
                                    </Text>
                                    <Text style={[styles.tableCell, styles.colPlan]}>
                                        {payment.planName || "N/A"}
                                    </Text>
                                    <Text style={[styles.tableCell, styles.colCard]}>
                                        {formatCardNumber(payment.cardLast4)}
                                    </Text>
                                    <View style={[styles.tableCell, styles.colStatus]}>
                                        <Text style={[styles.statusBadge, getStatusStyle(payment.status)]}>
                                            {payment.status || "N/A"}
                                        </Text>
                                    </View>
                                    <Text style={[styles.tableCell, styles.colDate, styles.lastCell]}>
                                        {formatDate(payment.updated_at)}
                                    </Text>
                                </View>
                            );
                        })
                    ) : (
                        <View style={[styles.tableRow, { padding: 20 }]}>
                            <Text style={{ textAlign: "center", width: "100%", color: "#94A3B8" }}>
                                No payment records found
                            </Text>
                        </View>
                    )}
                </View>

                {/* Footer with Statistics */}
                <View style={styles.footer}>
                    <Text>
                        Total Records: {totalPayments} | Active: {activePayments} | Pending: {pendingPayments}
                    </Text>
                    <Text>
                        Page 1 of 1
                    </Text>
                </View>

                {/* Additional Notes */}
                <View style={{ marginTop: 15, padding: 8, backgroundColor: "#F8FAFC", borderRadius: 4 }}>
                    <Text style={{ fontSize: 7, color: "#64748B" }}>
                        * This report includes all payment transactions in the system. Status indicates current payment state.
                    </Text>
                </View>
            </Page>
        </Document>
    );
};