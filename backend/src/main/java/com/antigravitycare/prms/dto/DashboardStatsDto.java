package com.antigravitycare.prms.dto;

public class DashboardStatsDto {
    private long totalPatients;
    private long totalDoctors;
    private long totalAppointments;
    private long pendingAppointments;
    private long completedAppointments;
    private long totalRecords;

    public DashboardStatsDto() {}

    public DashboardStatsDto(long totalPatients, long totalDoctors, long totalAppointments, long pendingAppointments, long completedAppointments, long totalRecords) {
        this.totalPatients = totalPatients;
        this.totalDoctors = totalDoctors;
        this.totalAppointments = totalAppointments;
        this.pendingAppointments = pendingAppointments;
        this.completedAppointments = completedAppointments;
        this.totalRecords = totalRecords;
    }

    public long getTotalPatients() { return totalPatients; }
    public void setTotalPatients(long totalPatients) { this.totalPatients = totalPatients; }

    public long getTotalDoctors() { return totalDoctors; }
    public void setTotalDoctors(long totalDoctors) { this.totalDoctors = totalDoctors; }

    public long getTotalAppointments() { return totalAppointments; }
    public void setTotalAppointments(long totalAppointments) { this.totalAppointments = totalAppointments; }

    public long getPendingAppointments() { return pendingAppointments; }
    public void setPendingAppointments(long pendingAppointments) { this.pendingAppointments = pendingAppointments; }

    public long getCompletedAppointments() { return completedAppointments; }
    public void setCompletedAppointments(long completedAppointments) { this.completedAppointments = completedAppointments; }

    public long getTotalRecords() { return totalRecords; }
    public void setTotalRecords(long totalRecords) { this.totalRecords = totalRecords; }
}
