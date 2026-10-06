"use client";

import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

interface User {
    id: string;
    name: string;
    email: string;
    phone_number: string | null;
    address: string | null;
    type: string;
    status: number;
    approved_at: string | null;
    created_at: string;
    updated_at: string;
}

type UserList = User[];

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

    // Column widths - adjust these based on your needs
    colId: { width: "15%" },
    colName: { width: "20%" },
    colEmail: { width: "25%" },
    colType: { width: "10%" },
    colStatus: { width: "15%" },
    colDate: { width: "15%" },
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

// Helper function to get status text and style
const getStatusInfo = (status: number) => {
    return {
        text: status === 1 ? "Active" : "Inactive",
        style: status === 1 ? styles.statusActive : styles.statusInactive,
    };
};

export const UserTableDownload = ({ apiItem }: { apiItem: UserList | undefined }) => {
    // If no data provided, use empty array
    const users = apiItem || [];

    // Calculate summary statistics
    const totalUsers = users.length;
    const activeUsers = users.filter(user => user.status === 1).length;
    const inactiveUsers = users.filter(user => user.status === 0).length;

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
                    <Text style={styles.title}>User Management Report</Text>
                    <Text style={styles.subtitle}>
                        Complete List of Registered Users
                    </Text>
                    <Text style={styles.dateRange}>
                        Generated on: {generationDate}
                    </Text>
                </View>

                {/* Summary Section */}
                {/* <View style={{ flexDirection: "row", marginBottom: 15, gap: 15 }}>
                    <View style={{ flex: 1, backgroundColor: "#EFF6FF", padding: 8, borderRadius: 4 }}>
                        <Text style={{ fontSize: 8, color: "#1E40AF" }}>Total Users</Text>
                        <Text style={{ fontSize: 16, fontWeight: "bold", color: "#1E3A8A" }}>{totalUsers}</Text>
                    </View>
                    <View style={{ flex: 1, backgroundColor: "#DCFCE7", padding: 8, borderRadius: 4 }}>
                        <Text style={{ fontSize: 8, color: "#166534" }}>Active Users</Text>
                        <Text style={{ fontSize: 16, fontWeight: "bold", color: "#14532D" }}>{activeUsers}</Text>
                    </View>
                    <View style={{ flex: 1, backgroundColor: "#FEE2E2", padding: 8, borderRadius: 4 }}>
                        <Text style={{ fontSize: 8, color: "#991B1B" }}>Inactive Users</Text>
                        <Text style={{ fontSize: 16, fontWeight: "bold", color: "#7F1D1D" }}>{inactiveUsers}</Text>
                    </View>
                </View> */}

                {/* Table */}
                <View style={styles.table}>
                    {/* Table Header */}
                    <View style={styles.tableHeader}>
                        <Text style={[styles.headerCell, styles.colId]}>User ID</Text>
                        <Text style={[styles.headerCell, styles.colName]}>Name</Text>
                        <Text style={[styles.headerCell, styles.colEmail]}>Email</Text>
                        <Text style={[styles.headerCell, styles.colType]}>Type</Text>
                        <Text style={[styles.headerCell, styles.colStatus]}>Status</Text>
                        <Text style={[styles.headerCell, styles.colDate, styles.lastCell]}>Created</Text>
                    </View>

                    {/* Table Body */}
                    {users.map((user, index) => {
                        const statusInfo = getStatusInfo(user.status);
                        const rowStyle = index % 2 === 0 ? styles.tableRow : [styles.tableRow, styles.tableRowEven];

                        return (
                            <View key={user.id} style={rowStyle}>
                                <Text style={[styles.tableCell, styles.colId]}>
                                    {user.id.substring(0, 8)}...
                                </Text>
                                <Text style={[styles.tableCell, styles.colName]}>
                                    {user.name || "N/A"}
                                </Text>
                                <Text style={[styles.tableCell, styles.colEmail]}>
                                    {user.email || "N/A"}
                                </Text>
                                <Text style={[styles.tableCell, styles.colType]}>
                                    {user.type || "user"}
                                </Text>
                                <View style={[styles.tableCell, styles.colStatus]}>
                                    <Text style={[styles.statusBadge, statusInfo.style]}>
                                        {statusInfo.text}
                                    </Text>
                                </View>
                                <Text style={[styles.tableCell, styles.colDate, styles.lastCell]}>
                                    {formatDate(user.created_at)}
                                </Text>
                            </View>
                        );
                    })}
                </View>

                {/* Footer with Statistics */}
                <View style={styles.footer}>
                    <Text>
                        Total Users: {totalUsers} | Active: {activeUsers} | Inactive: {inactiveUsers}
                    </Text>
                    <Text>
                        Page 1 of 1
                    </Text>
                </View>

                {/* Additional Notes */}
                <View style={{ marginTop: 15, padding: 8, backgroundColor: "#F8FAFC", borderRadius: 4 }}>
                    <Text style={{ fontSize: 7, color: "#64748B" }}>
                        * This report includes all registered users in the system. Status indicates account activation state.
                    </Text>
                    <Text style={{ fontSize: 7, color: "#64748B", marginTop: 3 }}>
                        ** Generated automatically. For official use only.
                    </Text>
                </View>
            </Page>
        </Document>
    );
};