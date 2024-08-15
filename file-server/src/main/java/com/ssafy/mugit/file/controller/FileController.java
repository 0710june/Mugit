package com.ssafy.mugit.file.controller;

import com.ssafy.mugit.file.dto.DeleteRequestDto;
import com.ssafy.mugit.file.service.FileDeleteService;
import com.ssafy.mugit.file.service.FileUploadService;
import com.ssafy.mugit.global.dto.ListDto;
import com.ssafy.mugit.global.dto.MessageDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/files")
@Tag(name = "File", description = "파일 업로드 및 삭제를 위한 API 입니다.")
public class FileController {

    private final FileUploadService fileUploadService;
    private final FileDeleteService fileDeleteService;

    @Operation(summary = "파일 업로드", description = "파일을 업로드 한다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "파일 업로드 완료",
                    content = @Content(schema = @Schema(implementation = MessageDto.class))),
            @ApiResponse(responseCode = "401", description = "세션 아이디 없음",
                    content = @Content(schema = @Schema(implementation = MessageDto.class))),
            @ApiResponse(responseCode = "403", description = "잘못된 세션 아이디",
                    content = @Content(schema = @Schema(implementation = MessageDto.class))),
            @ApiResponse(responseCode = "500", description = "내부 서버 오류",
                    content = @Content(schema = @Schema(implementation = MessageDto.class)))
    })
    @PostMapping
    public ResponseEntity<?> uploadFile(@RequestParam(value = "image", required = false) MultipartFile image,
                                        @RequestParam(value = "source", required = false) List<MultipartFile> source) {
        return new ResponseEntity<>(new ListDto(fileUploadService.uploadFile(image, source)), HttpStatus.OK);
    }

    @Operation(summary = "파일 삭제", description = "DB에서 사용되지 않는 파일을 삭제한다.  " +
            "path는 \"UPLOAD_PATH + 파일이름\" 형식으로 전달한다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "파일 삭제 완료",
                    content = @Content(schema = @Schema(implementation = MessageDto.class))),
            @ApiResponse(responseCode = "500", description = "내부 서버 오류",
                    content = @Content(schema = @Schema(implementation = MessageDto.class)))
    })
    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteFile(@RequestBody DeleteRequestDto deleteRequestDto) {
        fileDeleteService.fileDelete(deleteRequestDto.getPath());
        return new ResponseEntity<>(new MessageDto("File delete successful"), HttpStatus.OK);
    }
}
