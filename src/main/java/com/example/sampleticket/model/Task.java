package com.example.sampleticket.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;
import java.util.Date;

@Entity
@Table(name = "tasks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "task_name", nullable = false, length = 200)  // Added taskName
    private String taskName;

    @Column(name = "description", nullable = false, length = 500)
    private String description;
    @Temporal(TemporalType.DATE)

    @Column(name = "date", nullable = false)
    private Date date;


    @Column(name = "assigned_name", nullable = false, length = 100)
    private String assignedName;

    public User getAssignedUser() {
        return assignedUser;
    }

    public void setAssignedUser(User assignedUser) {
        this.assignedUser = assignedUser;
    }

    @ManyToOne
    private User assignedUser;

    public Long getId() {
        return id;
    }
    public String getDescription() {
        return description;
    }
    public Date getDate() {
        return date;
    }
    public String getAssignedName() {
        return assignedName;
    }
    public String getStatus() {
        return status;
    }

    public String getTaskName() {
        return taskName;
    }

    public void setTaskName(String taskName) {
        this.taskName = taskName;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public String getTier() {
        return tier;
    }

    public void setTier(String tier) {
        this.tier = tier;
    }

    @Column(name = "status", nullable = false, length = 50)
    private String status;
    @Column(name = "category", nullable = false, length = 50)
    private String category;

    @Column(name = "tier", nullable = false, length = 50)
    private String tier;

    @Column(name = "remarks", nullable = true, length = 500)  // Added remarks
    private String remarks;


    public void setDescription(String description) {
        this.description = description;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public void setAssignedName(String assignedName) {
        this.assignedName = assignedName;
    }

    public void setStatus(String status) {
        this.status = status;
    }
    public void updateCategoryBasedOnStatus() {
        switch (status.toLowerCase()) {
            case "open":
                this.category = "open";
                break;
            case "wip":
                this.category = "wip";
                break;
            case "querry raised":
                this.category = "querry raised";
                break;
            case "peer review":
                this.category = "peer review";
                break;
            case "head review":
                this.category="head review";
                break;
            case "lead review":
                this.category="lead review";
                break;
            case "completed":
                this.category="completed";
                break;
            default:
                this.category = "unknown";
        }
    }
    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }
    @PrePersist
    @PreUpdate
    public void preSave() {
        updateCategoryBasedOnStatus();
    }
}
