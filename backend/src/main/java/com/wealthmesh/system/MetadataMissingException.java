package com.wealthmesh.system;

public class MetadataMissingException extends RuntimeException {
    public MetadataMissingException() {
        super("Installation metadata missing");
    }
}
