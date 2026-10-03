package com.wealthmesh.system;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.springframework.dao.DataAccessResourceFailureException;

class SystemStatusServiceTest {
    private final InstallationMetadataRepository metadata = mock(InstallationMetadataRepository.class);
    private final SystemStatusService service = new SystemStatusService(metadata);

    @Test
    void readsTheStoredTextualVersionRatherThanHardcodingIt() {
        when(metadata.findSetupVersion()).thenReturn(Optional.of("2"));

        assertThat(service.readStatus()).isEqualTo(new SystemStatus("ready", "2"));
        verify(metadata).findSetupVersion();
    }

    @Test
    void reportsMissingMetadataWithoutRepairingIt() {
        when(metadata.findSetupVersion()).thenReturn(Optional.empty());

        assertThatThrownBy(service::readStatus).isInstanceOf(MetadataMissingException.class);
        verify(metadata).findSetupVersion();
    }

    @Test
    void preservesDatabaseFailuresForTheHttpBoundary() {
        when(metadata.findSetupVersion()).thenThrow(new DataAccessResourceFailureException("synthetic failure"));

        assertThatThrownBy(service::readStatus).isInstanceOf(DataAccessResourceFailureException.class);
    }
}
