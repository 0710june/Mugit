package com.ssafy.mugit.infrastructure.repository;

import com.ssafy.mugit.domain.exception.SseException;
import com.ssafy.mugit.domain.exception.error.SseError;
import org.springframework.stereotype.Repository;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Repository
public class SseQueueContainerRepository {

    private final Map<Long, SseQueueContainer> sseQueueContainerMap = new ConcurrentHashMap<>();

    public SseQueueContainer save(Long id, SseEmitter emitter) {
        if (!sseQueueContainerMap.containsKey(id))  sseQueueContainerMap.put(id, new SseQueueContainer(emitter));
        else sseQueueContainerMap.get(id).changeEmitter(emitter);
        return findById(id);
    }

    public SseQueueContainer findById(Long id) {
        if (!sseQueueContainerMap.containsKey(id)) return null;
        return sseQueueContainerMap.get(id);
    }

    public boolean existsById(Long id) {
        return sseQueueContainerMap.containsKey(id);
    }

    public void deleteEmitterById(long userId) {
        SseQueueContainer sseQueueContainer = sseQueueContainerMap.get(userId);
        if (sseQueueContainer == null) throw new SseException(SseError.SSE_QUEUE_CONTAINER_NOT_FOUND);
        sseQueueContainer.deleteEmitter();
    }

    public int size() {
        return sseQueueContainerMap.size();
    }

    public void clear() {
        this.sseQueueContainerMap.clear();
    }
}
